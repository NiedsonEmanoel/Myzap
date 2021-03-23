import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import WhatsApp from './pages/admin/Whatsapp/index'
import Dashboard from './pages/admin/dashboard';
import Usuarios from './pages/admin/usuarios';
import UsuariosEditar from './pages/admin/usuarios/usuarios.editar';
import UsuariosCadastrar from './pages/admin/usuarios/cadastro.usuarios';
import Page404 from './pages/404/NotFound'

import Login from './pages/admin/login';
import Funcionarios from './pages/admin/funcionarios/index'
import FuncionariosCadastrar from './pages/admin/funcionarios/funcionarios.cadastro';
export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Usuarios} />
                <Route path="/admin" exact component={Dashboard} />
                <Route path="/admin/login" exact component={Login} />

                <Route path="/admin/whatsapp" exact component={WhatsApp} />

                <Route path="/admin/usuarios" exact component={Usuarios} />
                <Route path="/admin/usuarios/cadastrar" exact component={UsuariosCadastrar} />
                <Route path="/admin/usuarios/editar/:idUsuario" exact component={UsuariosEditar} />

                <Route path="/admin/funcionarios" exact component={Funcionarios} />
                <Route path="/admin/funcionarios/cadastrar" exact component={FuncionariosCadastrar} />

                <Route path="*">
                    <Page404 />
                </Route>

            </Switch>
        </BrowserRouter>
    );
}