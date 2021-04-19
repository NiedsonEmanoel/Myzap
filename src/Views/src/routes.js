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
import FuncionariosEditar from './pages/admin/funcionarios/funcionarios.editar';
import FuncionariosCadastrar from './pages/admin/funcionarios/funcionarios.cadastro';

import Sessions from './pages/admin/sessions'

import PrivateRoute from './services/wAuth';

// 

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <PrivateRoute path="/" exact component={Usuarios} />
                s
                <PrivateRoute path="/admin" exact component={Dashboard} />
                <Route path="/admin/login" exact component={Login} />

                <PrivateRoute path="/admin/whatsapp" exact component={WhatsApp} />

                <PrivateRoute path="/admin/usuarios" exact component={Usuarios} />
                <PrivateRoute path="/admin/usuarios/cadastrar" exact component={UsuariosCadastrar} />
                <PrivateRoute path="/admin/usuarios/editar/:idUsuario" exact component={UsuariosEditar} />

                <PrivateRoute path="/admin/funcionarios" exact component={Funcionarios} />
                <PrivateRoute path="/admin/funcionarios/editar/:idFuncionario" exact component={FuncionariosEditar} />
                <PrivateRoute path="/admin/funcionarios/cadastrar" exact component={FuncionariosCadastrar} />

                <PrivateRoute path="/admin/sessions" exact component={Sessions} />

                <Route path="*">
                    <Page404 />
                </Route>

            </Switch>
        </BrowserRouter>
    );
}