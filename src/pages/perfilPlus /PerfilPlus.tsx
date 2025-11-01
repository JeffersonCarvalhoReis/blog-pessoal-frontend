import {
    useContext,
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import type Usuario from "../../models/Usuario";
import { atualizar, buscar } from "../../services/Service";
import { ToastAlerta } from "../../utils /ToastAlerta";

function PerfilPlus() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [usuarioLogado, setUsuarioLogado] = useState<Usuario>({} as Usuario);
    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    async function getUserById(id: string) {
        try {
            await buscar(
                `/usuarios/${id}`,
                (dados: Usuario) => {
                    dados.senha = "";
                    setUsuarioLogado(dados);
                },
                {
                    headers: { Authorization: usuario.token },
                }
            );
        } catch (error: any) {
            if (error.toString().includes("401")) {
                ToastAlerta("Você precisa estar logado", "info");
                navigate("/");
            }
        }
    }

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setUsuarioLogado({
            ...usuarioLogado,
            [e.target.name]: e.target.value,
        });
    }

    useEffect(() => {
        if (id !== undefined) {
            getUserById(id);
        }
    }, [id]);
    async function atualizarUsuario(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (id !== undefined) {
            try {
                await atualizar(
                    `/usuarios/atualizar`,
                    usuarioLogado,
                    setUsuarioLogado,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                ToastAlerta("Usuário atualizado com sucesso", "sucesso");
            } catch (error: any) {
                if (error.toString().includes("401")) {
                    handleLogout();
                } else {
                    ToastAlerta("Erro ao atualizar usuário", "erro");
                }
            }
        }
    }

    return (
        <div className="container mx-auto my-10 flex flex-col gap-4">
            <div className="flex flex-col items-center">
                <h2 className="text-center text-sky-900 font-bold text-4xl">
                    Dados de perfil
                </h2>
                <div className="flex gap-8 mt-4 items-center">
                    <img
                        src={
                            usuarioLogado.foto ||
                            "https://ik.imagekit.io/2zvbvzaqt/usuario.png"
                        }
                        alt=""
                        className="border-4 border-sky-800 rounded-2xl w-56"
                    />
                    <div className="">
                        <p className="font-semibold text-sky-900 text-3xl">
                            {usuarioLogado.nome}
                        </p>
                        <p className="font-semibold text-sky-900 text-lg">
                            {usuarioLogado.usuario}
                        </p>
                    </div>
                </div>
                <hr className="border-sky-900 border w-full my-4" />
                <div className="w-1/2">
                    <h2>Atualizar dados</h2>
                    <form
                        className=""
                        onSubmit={atualizarUsuario}
                    >
                        <div className="flex flex-col w-full">
                            <label htmlFor="nome">Nome</label>
                            <input
                                type="text"
                                name="nome"
                                id="nome"
                                placeholder="Nome completo"
                                className="border-2 border-slate-700 rounded p-2"
                                value={usuarioLogado.nome}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    atualizarEstado(e)
                                }
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <label htmlFor="usuario">Usuário</label>
                            <input
                                type="text"
                                name="usuario"
                                id="usuario"
                                placeholder="Seu melhor e-mail"
                                className="border-2 border-slate-700 rounded p-2"
                                disabled
                                value={usuarioLogado.usuario}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    atualizarEstado(e)
                                }
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <label htmlFor="foto">Foto</label>
                            <input
                                type="text"
                                name="foto"
                                id="foto"
                                placeholder="URL da foto"
                                className="border-2 border-slate-700 rounded p-2"
                                value={usuarioLogado.foto}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    atualizarEstado(e)
                                }
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <label htmlFor="senha">Senha</label>
                            <input
                                type="password"
                                name="senha"
                                id="senha"
                                placeholder="Senha (minimo 8 caracteres)"
                                className="border-2 border-slate-700 rounded p-2"
                                value={usuarioLogado.senha}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    atualizarEstado(e)
                                }
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-4 rounded disabled:bg-slate-200 bg-indigo-400 hover:bg-indigo-800
                               text-white font-bold w-1/2 mx-auto py-2 flex justify-center"
                        >
                            Atualizar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PerfilPlus;
