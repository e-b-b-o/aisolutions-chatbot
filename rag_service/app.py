from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import os
import time
from rag import add_documents, query_rag, get_gemini_response, reset_db_internal
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route('/ingest', methods=['POST'])
def ingest():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Request body is required"}), 400

        documents = data.get('documents')
        ids = data.get('ids')

        if not documents or not ids:
            return jsonify({"error": "Missing documents or ids"}), 400

        add_documents(documents, ids)

        return jsonify({"message": "Documents ingested successfully"}), 200

    except Exception as e:
        print("❌ Ingest Error:", str(e))
        return jsonify({"error": "Failed to ingest documents"}), 500

@app.route('/reset', methods=['POST'])
def reset_db():
    try:
        reset_db_internal()
        return jsonify({"message": "Knowledge base reset successfully"}), 200
    except Exception as e:
        print("❌ Reset Error:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route('/query', methods=['POST'])
def query():
    try:
        data = request.get_json()

        if not data or 'query' not in data:
            return jsonify({"error": "Query is required"}), 400

        query_text = str(data['query'])
        history = data.get('history', [])

        # Retrieve relevant documents
        results = query_rag(query_text)

        if not results or "documents" not in results:
            return jsonify({"error": "No documents found"}), 404

        documents = results.get("documents", [[]])

        if not documents or not documents[0]:
            # Still return a 200 but with a message if no docs
            context_text = "No relevant context found."
        else:
            context_text = "\n\n".join(documents[0])

        # Generate Gemini response (this returns a generator now)
        generator = get_gemini_response(query_text, context_text, history)

        def stream():
            try:
                for chunk in generator:
                    # SSE format: data: <message>\n\n
                    yield f"data: {chunk}\n\n"
            except Exception as e:
                yield f"data: [ERROR]: {str(e)}\n\n"

        return Response(stream(), mimetype='text/event-stream', headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Connection': 'keep-alive'
        })

    except Exception as e:
        error_message = repr(e)
        print("❌ RAG Internal Error:", error_message)

        # Gemini quota exceeded
        if "429" in error_message or "quota" in error_message.lower():
            return jsonify({"error": "Quota exceeded. Please try again later."}), 429

        return jsonify({"error": "Internal RAG service error."}), 500


@app.route('/health', methods=['GET'])
def health_check():
    api_key_status = "set" if (os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")) else "missing"

    return jsonify({
        "status": "healthy",
        "api_key": api_key_status,
        "service": "rag_service"
    }), 200


if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))

    key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

    if not key:
        print("❌ WARNING: No API Key found (GEMINI_API_KEY or GOOGLE_API_KEY). RAG will fail.")
    else:
        print(f"✅ API Key detected: {key[:4]}...{key[-4:]}")

    app.run(host='0.0.0.0', port=port, threaded=True)
