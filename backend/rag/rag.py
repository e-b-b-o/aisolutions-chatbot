import os
import pypdf
import json
import chromadb
from google import genai
from google.genai import types
from chromadb.utils import embedding_functions
from chromadb.config import Settings

# Force disable telemetry before importing chromadb
os.environ["CHROMA_ANONYMIZED_TELEMETRY"] = "False"
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("❌ WARNING: No API Key found.")

client = genai.Client(api_key=api_key) if api_key else None

chroma_client = chromadb.PersistentClient(path="chroma_db", settings=Settings(anonymized_telemetry=False))

class GeminiEmbeddingFunction(chromadb.EmbeddingFunction):
    def __call__(self, input: chromadb.Documents) -> chromadb.Embeddings:
        if not client:
            return []
        model = "models/gemini-embedding-001"
        return [
            client.models.embed_content(
                model=model,
                contents=str(text),
                config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT", title="RAG Document")
            ).embeddings[0].values
            for text in input
        ]

collection = chroma_client.get_or_create_collection(
    name="documents_v3",
    embedding_function=GeminiEmbeddingFunction() 
)

def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, 'rb') as file:
        reader = pypdf.PdfReader(file)
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
    return text

def extract_text_from_txt(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def extract_text_from_docx(file_path):
    import docx
    doc = docx.Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])

def extract_text(file_path):
    """Extract text based on file extension."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.pdf':
        return extract_text_from_pdf(file_path)
    elif ext == '.txt':
        return extract_text_from_txt(file_path)
    elif ext == '.docx':
        return extract_text_from_docx(file_path)
    else:
        # Try as plain text fallback
        return extract_text_from_txt(file_path)

def chunk_text(text, chunk_size=1000):
    words = text.split()
    chunks = []
    current_chunk = []
    current_len = 0
    
    for word in words:
        current_chunk.append(word)
        current_len += len(word) + 1
        if current_len >= chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_len = 0
            
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks

def ingest_document(document_id, file_path):
    text = extract_text(file_path)
    if not text.strip():
        raise ValueError("Document contains no readable text.")
        
    chunks = chunk_text(text, chunk_size=1200)
    
    ids = [f"{document_id}_{i}" for i in range(len(chunks))]
    metadatas = [{"document_id": document_id} for _ in chunks]
    
    collection.add(
        documents=chunks,
        ids=ids,
        metadatas=metadatas
    )

def retrieve_all_context(document_id):
    results = collection.get(
        where={"document_id": document_id}
    )
    if not results or not results['documents']:
        return "No content found for this document."
    
    return "\n\n".join(results['documents'])

def delete_document_vectors(document_id):
    collection.delete(where={"document_id": document_id})

def _strict_generation(document_id, system_instruction, response_schema=None):
    if not client:
        raise ValueError("Gemini API Client not initialized.")
        
    context_text = retrieve_all_context(document_id)
    
    prompt = f"""
<context>
{context_text}
</context>
"""
    config_params = {
        "system_instruction": system_instruction,
        "temperature": 0.1
    }
    
    if response_schema:
        config_params["response_mime_type"] = "application/json"
        config_params["response_schema"] = response_schema
        
    config = types.GenerateContentConfig(**config_params)
    
    response = client.models.generate_content(
        model='models/gemini-2.5-flash',
        contents=prompt,
        config=config
    )
    
    return response.text

def generate_summary(document_id):
    instruction = (
        "You are an academic analyzer. Use ONLY the provided context within the <context> tags to create a structured academic summary. "
        "If the provided text does not contain enough information, you MUST respond exactly with: "
        "'The uploaded material does not contain enough information.' "
        "Do not use external knowledge. Use markdown formatting with clear headings."
    )
    return _strict_generation(document_id, instruction)

def generate_quiz(document_id):
    instruction = (
        "You are an academic analyzer. Use ONLY the provided context within the <context> tags to create exactly a 10-question multiple-choice quiz. "
        "If the provided text does not contain enough information to generate 10 questions, respond by creating as many as possible based ONLY on the text. "
        "Do not use external knowledge. Do not guess."
    )
    
    schema = {
        "type": "ARRAY",
        "description": "A list of exactly 10 multiple choice questions.",
        "items": {
            "type": "OBJECT",
            "properties": {
                "question": {"type": "STRING"},
                "options": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"},
                    "description": "Exactly 4 options"
                },
                "correctAnswer": {"type": "STRING"}
            },
            "required": ["question", "options", "correctAnswer"]
        }
    }
    
    response_text = _strict_generation(document_id, instruction, schema)
    
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        print("Failed to decode JSON from Gemini:", response_text)
        raise ValueError("Failed to generate valid quiz JSON.")

def generate_flashcards(document_id):
    instruction = (
        "You are an academic analyzer. Use ONLY the provided context within the <context> tags to create 15-20 flashcards. "
        "Each flashcard should have a 'front' (question/term) and 'back' (answer/definition). "
        "Focus on key concepts, definitions, and important facts. "
        "Do not use external knowledge."
    )
    
    schema = {
        "type": "ARRAY",
        "description": "A list of flashcards with front and back.",
        "items": {
            "type": "OBJECT",
            "properties": {
                "front": {"type": "STRING", "description": "The question or term"},
                "back": {"type": "STRING", "description": "The answer or definition"}
            },
            "required": ["front", "back"]
        }
    }
    
    response_text = _strict_generation(document_id, instruction, schema)
    
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        print("Failed to decode JSON from Gemini:", response_text)
        raise ValueError("Failed to generate valid flashcards JSON.")

def generate_notes(document_id):
    instruction = (
        "You are an academic note-taker. Use ONLY the provided context within the <context> tags to create concise, well-organized study notes. "
        "Use markdown formatting with clear headings, bullet points, and key highlights. "
        "Focus on the most important concepts, formulas, definitions, and relationships. "
        "Make the notes scannable and easy to review before an exam. "
        "Do not use external knowledge."
    )
    return _strict_generation(document_id, instruction)

def chat_with_document(document_id, message):
    if not client:
        raise ValueError("Gemini API Client not initialized.")
        
    context_text = retrieve_all_context(document_id)
    
    system_instruction = (
        "You are an AI tutor that helps students understand their study material. "
        "Use ONLY the provided context within the <context> tags to answer the student's question. "
        "If the answer is not in the context, say: 'I couldn't find information about that in your uploaded material.' "
        "Be helpful, clear, and concise. Use markdown formatting when appropriate. "
        "Do not use external knowledge."
    )
    
    prompt = f"""
<context>
{context_text}
</context>

Student's question: {message}
"""
    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        temperature=0.3
    )
    
    response = client.models.generate_content(
        model='models/gemini-2.5-flash',
        contents=prompt,
        config=config
    )
    
    return response.text
