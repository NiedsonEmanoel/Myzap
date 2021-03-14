import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Dashboard from './pages/admin/dashboard';
import Produtos from './pages/admin/produtos';
import ProdutoEditar from './pages/admin/produtos/produtos.editar';
import ProdutoCadastrar from './pages/admin/produtos/produtos.cadastrar';
import Usuarios from './pages/admin/usuarios';
import UsuariosEditar from './pages/admin/usuarios/usuarios.editar';
import UsuariosCadastrar from './pages/admin/usuarios/usuarios.cadastrar';
import Page404 from './pages/404/NotFound'
import Login from './pages/admin/login';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Usuarios} />
                <Route path="/admin" exact component={Dashboard} />
                <Route path="/admin/login" exact component={Login} />

                <Route path="/admin/produtos" exact component={Produtos} />
                <Route path="/admin/produtos/cadastrar" exact component={ProdutoCadastrar} />
                <Route path="/admin/produtos/editar/:idProduto" exact component={ProdutoEditar} />

                <Route path="/admin/usuarios" exact component={Usuarios} />
                <Route path="/admin/usuarios/cadastrar" exact component={UsuariosCadastrar} />
                <Route path="/admin/usuarios/editar/:idProduto" exact component={UsuariosEditar} />

                <Route path ="*">
                    <Page404 />
                </Route>

            </Switch>
        </BrowserRouter>
    );
}