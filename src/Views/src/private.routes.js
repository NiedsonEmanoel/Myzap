import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import WhatsApp from './pages/admin/Whatsapp/index'
import Dashboard from './pages/admin/dashboard';
import Usuarios from './pages/admin/usuarios';
import UsuariosEditar from './pages/admin/usuarios/usuarios.editar';
import UsuariosCadastrar from './pages/admin/usuarios/cadastro.usuarios';
import Page404 from './pages/404/NotFound'
import { SnackbarProvider } from 'notistack';
import Collapse from '@material-ui/core/Collapse';
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
            <>
                <SnackbarProvider
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    TransitionComponent={Collapse}
                    maxSnack={3}
                >
                    <Switch>
                        <PrivateRoute path="/" exact={true} component={Usuarios} />

                        <PrivateRoute path="/admin" exact={true} component={Dashboard} />
                        <Route path="/admin/login" exact={true} component={Login} />

                        <PrivateRoute path="/admin/whatsapp" exact={true} component={WhatsApp} />

                        <PrivateRoute path="/admin/usuarios" exact={true} component={Usuarios} />
                        <PrivateRoute path="/admin/usuarios/cadastrar" exact component={UsuariosCadastrar} />
                        <PrivateRoute path="/admin/usuarios/editar/:idUsuario" exact component={UsuariosEditar} />

                        <PrivateRoute path="/admin/funcionarios" exact={true} component={Funcionarios} />
                        <PrivateRoute path="/admin/funcionarios/editar/:idFuncionario" exact component={FuncionariosEditar} />
                        <PrivateRoute path="/admin/funcionarios/cadastrar" exact={true} component={FuncionariosCadastrar} />

                        <PrivateRoute path="/admin/sessions" exact={true} component={Sessions} />

                        <Route path="*" exact={true}>
                            <Page404 />
                        </Route>

                    </Switch>
                </SnackbarProvider>
            </>

        </BrowserRouter>
    );
}