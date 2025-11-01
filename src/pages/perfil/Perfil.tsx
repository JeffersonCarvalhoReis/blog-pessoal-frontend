import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastAlerta } from "../../utils /ToastAlerta";

function Perfil() {
    const navigate = useNavigate();

    const { usuario } = useContext(AuthContext);

    useEffect(() => {
        if (usuario.token === "") {
            ToastAlerta("Você precisa estar logado", "info");
            navigate("/");
        }
    }, [usuario.token]);

    return (
        <div className="flex justify-center mx-4">
            <div className="container mx-auto my-4 rounded-2xl overflow-hidden">
                <img
                    className="w-full h-72 object-cover border-b-8 border-white"
                    src="https://i.imgur.com/ZZFAmzo.jpg"
                    alt="Capa do Perfil"
                />

                <Link to={`/perfilplus/${usuario.id}`}>
                    <img
                        src={
                            usuario.foto ||
                            "https://ik.imagekit.io/2zvbvzaqt/usuario.png"
                        }
                        className="rounded-full aspect-square object-cover w-56 mx-auto -mt-32 border-8 border-white relative z-10"
                        alt={`Foto de perfil de ${usuario.nome}`}
                    />
                </Link>

                <div
                    className="relative -mt-24 h-72 flex flex-col 
                    bg-sky-500 text-white text-2xl items-center justify-center"
                >
                    <p>Nome: {usuario.nome} </p>
                    <p>Email: {usuario.usuario}</p>
                </div>
            </div>
        </div>
    );
}

export default Perfil;
