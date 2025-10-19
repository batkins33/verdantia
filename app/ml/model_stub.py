def predict(image_bytes: bytes) -> dict:
    """Mock predict function returning top-3 species candidates."""
    return {
        "top_species": [
            {"species_id":"sp_ficus_lyrata","confidence":0.76},
            {"species_id":"sp_monstera_deliciosa","confidence":0.14},
            {"species_id":"sp_schefflera_arboricola","confidence":0.10}
        ]
    }
