import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

//Imports Admin
import Dashboard from './pages/admin/dashboard';
import Produtos from './pages/admin/produtos';
import ProdutoEditar from './pages/admin/produtos/produtos.editar';
import ProdutoCadastrar from './pages/admin/produtos/produtos.cadastrar';

import Usuarios from './pages/admin/usuarios';
import UsuariosEditar from './pages/admin/usuarios/usuarios.editar';
import UsuariosCadastrar from './pages/admin/usuarios/usuarios.cadastrar';

import Page404 from './pages/404/NotFound'

//Imports Client
import Home from './pages/client/home';
import ProdutosDetails from './pages/client/produtos/produtos.details';

export default function Routes() {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Home} />
            <Route path="/produtos/:idProduto" exact component={ProdutosDetails} />

            <Route path="/admin" exact component={Dashboard} />
            <Route path="/admin/produtos" exact component={Produtos} />
            <Route path="/admin/produtos/cadastrar" exact component={ProdutoCadastrar} />
            <Route path="/admin/produtos/editar/:idProduto" exact component={ProdutoEditar} />

            <Route path="/admin/usuarios" exact component={Usuarios} />
            <Route path="/admin/usuarios/cadastrar" exact component={UsuariosCadastrar} />
            <Route path="/admin/usuarios/editar/:idProduto" exact component={UsuariosEditar} />
            <Route path='*'>
                <Page404 />
            </Route>
        </BrowserRouter>
    );
}