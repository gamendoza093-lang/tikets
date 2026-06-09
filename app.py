from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Permite que tu HTML se comunique con Python

ARCHIVODB = "tickets_db.txt"
ENCABEZADO = "ID|Fecha|Cliente|Telefono|Tipo|Marca|Dispositivo|Tecnico|Descripcion|Estado\n"

# Asegurar que el archivo de base de datos exista con su encabezado
if not os.path.exists(ARCHIVODB):
    with open(ARCHIVODB, "w", encoding="utf-8") as f:
        f.write(ENCABEZADO)

def leer_tickets_txt():
    """Lee el archivo .txt y lo convierte en una lista de diccionarios para JavaScript"""
    tickets = []
    if not os.path.exists(ARCHIVODB):
        return tickets
        
    with open(ARCHIVODB, "r", encoding="utf-8") as f:
        lineas = f.readlines()
        
    if len(lineas) <= 1:
        return tickets
        
    # Saltamos la primera línea (encabezado)
    for linea in lineas[1:]:
        linea = linea.strip()
        if not linea:
            continue
        campos = linea.split("|")
        if len(campos) >= 9:
            tickets.append({
                "id":          campos[0],
                "fecha":       campos[1],
                "cliente":     campos[2],
                "telefono":    campos[3],
                "tipo":        campos[4],
                "marca":       campos[5],
                "dispositivo": campos[6],
                "tecnico":     campos[7],
                "descripcion": campos[8],
                "estado":      campos[9] if len(campos) > 9 else "Pendiente"
            })
    return tickets

def guardar_tickets_txt(tickets):
    """Somete y sobrescribe la lista completa de tickets de vuelta al archivo .txt"""
    with open(ARCHIVODB, "w", encoding="utf-8") as f:
        f.write(ENCABEZADO)
        for t in tickets:
            # Reemplazar saltos de línea en la descripción para no romper el formato de filas
            desc = t["descripcion"].replace("\n", " ").replace("\r", "")
            linea = f"{t['id']}|{t['fecha']}|{t['cliente']}|{t['telefono']}|{t['tipo']}|{t['marca']}|{t['dispositivo']}|{t['tecnico']}|{desc}|{t['estado']}\n"
            f.write(linea)

@app.route("/api/tickets", methods=["GET"])
def obtener_tickets():
    """Ruta para leer todos los tickets"""
    return jsonify(leer_tickets_txt())

@app.route("/api/tickets", methods=["POST"])
def guardar_todos_tickets():
    """Ruta para guardar o actualizar la lista completa de tickets"""
    datos = request.get_json()
    if isinstance(datos, list):
        guardar_tickets_txt(datos)
        return jsonify({"status": "success", "message": "Base de datos .txt actualizada automáticamente"}), 200
    return jsonify({"status": "error", "message": "Datos inválidos"}), 400

if __name__ == "__main__":
    print("🚀 Servidor de Soporte UNO corriendo en http://127.0.0.1:5000")
    app.run(debug=True, port=5000)