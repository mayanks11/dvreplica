import React from 'react'
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link, withRouter } from 'react-router-dom';
import { Form, FormGroup, Input, FormFeedback, FormText } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { Fab } from "@material-ui/core";
import firebase from '../firebase/index'

import AppConfig from 'Constants/AppConfig';

// redux action
import {
  emailPasswordResetOtp,
  resetPasswordUsingOtp,
  resetForgotPasswordState,
  emailPasswordResetLink
} from 'Actions';
import { NotificationManager } from 'react-notifications';

class ResetPassword extends React.Component{
    constructor(props){
        super(props)
        this.state={
            newPassword:'',
            confirmPassword:'',
            isPasswordValid:false,
            disabled:false
        }
    }
    componentDidMount(){
        // console.log("props>>>",this.props)
        const resetCode=this.props.location && this.props.location.search && this.props.location.search.split("&") ?
        this.props.location.search.split("&")[1]:''
        console.log("resetCode",resetCode)
        const code=resetCode && resetCode.split("=") ? resetCode.split("=")[1]:''
        firebase.auth().verifyPasswordResetCode(code)
        .then((email)=> {
            this.setState({email:email,disabled:false,code:code})
        })
        .catch((error)=> {
            this.props.history.push('/signin')
            NotificationManager.error("Code is not valid")

        })
    }
    onChangePassword=(event)=>{
        let password=event.target.value;

        const regex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        this.setState({
            newPassword:password,
            isPasswordValid:regex.test(password)
        })
    }
    onPasswordReset=()=>{
        const {newPassword,isPasswordValid,confirmPassword,code}=this.state
        this.setState({
            isSubmitted:true
        })
        if(newPassword && isPasswordValid && newPassword=== confirmPassword){
            firebase.auth().confirmPasswordReset(code, newPassword)
                .then((res)=>{
                    this.props.history.push('/signin')
                })
                .catch((err)=> {
                    NotificationManager.error("Cannot Update the password")
                })
        }
    }
    render(){
        const {newPassword,isPasswordValid,confirmPassword,isSubmitted}=this.state
        console.log("state>>",this.state)
        return (
            <QueueAnim type="bottom" duration={2000}>
        <div className="rct-session-wrapper">
          {/* {loading &&
                  <LinearProgress />
               } */}
          <AppBar position="static" className="session-header">
            <Toolbar>
              <div className="container">
                <div className="d-flex justify-content-between">
                  <div className="session-logo">
                    <Link to="/">
                      <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
                    </Link>
                  </div>
                  {/* <div>
                              <a className="mr-15" onClick={() => this.onUserSignUp()}>Create New account?</a>
                              <Button variant="contained" className="btn-light" onClick={() => this.onUserSignUp()}>Sign Up</Button>
                           </div> */}
                </div>
              </div>
            </Toolbar>
          </AppBar>
          <div className="session-inner-wrapper">
            <div className="container">
              <div className="row row-eq-height">
                <div className="col-sm-7 col-md-7 col-lg-8">
                  <div className="session-body text-center">
                    <div className="session-head mb-30">
                      <h2 className="font-weight-bold">Reset Password</h2>
                      <p className="mb-0">Please enter your new password</p>
                    </div>
                    <Form>
                    <FormGroup className="has-wrapper">
                        <Input
                        type="email"
                        className="has-input input-lg"
                          value={this.state.email}
                          disabled={true}
                        />
                          <span className="has-icon"><i className="ti-email"></i></span>
                         
                      </FormGroup>
                      <FormGroup className="has-wrapper">
                        <Input
                        type="password"
                          value={this.state.newPassword}
                          className="has-input input-lg"
                          placeholder="Enter new password"
                          onChange={this.onChangePassword}
                        />
                          <span className="has-icon"><i className="ti-lock"></i></span>
                          {
                          isSubmitted  && !isPasswordValid &&
                          <span style={{color:'red',fontSize:12}}>
                              Please enter a valid password
                          </span>
                      }
                      </FormGroup>
                      
                      <FormGroup className="has-wrapper">
                        <Input
                          type="password"
                          value={this.state.confirmPassword}
                          className="has-input input-lg"
                          placeholder="Confirm new password"
                          onChange={(event) => this.setState({ confirmPassword: event.target.value })}
                        />
                          <span className="has-icon"><i className="ti-lock"></i></span>
                          {
                        isSubmitted && confirmPassword !==newPassword &&
                          <span style={{color:'red',fontSize:12}}>
                              Password and Confirm password is not same
                          </span>
                      }
                      </FormGroup>
                     
                      <FormGroup className="mb-15">
                        <Button
                          color="primary"
                          className="btn-block text-white w-100"
                          variant="contained"
                          size="large"
                          onClick={this.onPasswordReset}
                        > Update Password </Button>
                      </FormGroup>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </QueueAnim>
        )
    }
}

export default ResetPassword;