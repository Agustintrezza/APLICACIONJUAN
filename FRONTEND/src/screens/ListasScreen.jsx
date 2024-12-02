import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Textarea, Button, useToast } from "@chakra-ui/react";
import { API_URL } from "../config";

const ListasScreen = () => {
  const [formData, setFormData] = useState({
    posicion: "",
    cliente: "",
    comentario: "",
    fechaLimite: "",
    color: "#FFFFFF",
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/listas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al crear la lista");

      toast({
        title: "Éxito",
        description: "Lista creada correctamente",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/listas");
    } catch {
      toast({
        title: "Error",
        description: "No se pudo crear la lista",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Posición"
          value={formData.posicion}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, posicion: e.target.value }))
          }
        />
        <Input
          placeholder="Cliente"
          value={formData.cliente}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, cliente: e.target.value }))
          }
        />
        <Textarea
          placeholder="Comentario"
          value={formData.comentario}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, comentario: e.target.value }))
          }
        />
        <Input
          type="date"
          value={formData.fechaLimite}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, fechaLimite: e.target.value }))
          }
        />
        <Input
          type="color"
          value={formData.color}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, color: e.target.value }))
          }
        />
        <Button type="submit" colorScheme="blue">
          Crear Lista
        </Button>
      </form>
    </div>
  );
};

export default ListasScreen;
