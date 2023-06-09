/**
 * User Block Component
 */
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Badge } from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import * as firebase from '../../firebase';
// components
import SupportPage from '../Support/Support';

// redux action
import { logoutUserFromFirebase } from 'Actions';

// intl messages
import IntlMessages from 'Util/IntlMessages';

class UserBlock extends Component {

	constructor(props){
		super(props)
		this.logoutUser = this.logoutUser.bind(this)
		
		this.state = {
			userDropdownMenu: false,
			isSupportModal: false,
			userName: '',
			companyName: ''
		}
	}

	async componentDidMount() {
		const { fireStore } = firebase;
		const email = firebase.auth.currentUser.email;
		try {
			const result = await fireStore.collection('users').where('Email', '==', email).get();

			result.forEach(doc => {
				const {
					FirstName,
					CompanyName
				} = doc.data();
				this.setState({
					userName: FirstName,
					companyName: CompanyName
				});
			})

		}
		catch(err) {
			console.log(err);
		}
	}

	/**
	 * Logout User
	 */
	logoutUser() {
		this.props.logoutUserFromFirebase();
	}

	/**
	 * Toggle User Dropdown Menu
	 */
	toggleUserDropdownMenu() {
		this.setState({ userDropdownMenu: !this.state.userDropdownMenu });
	}

	/**
	 * Open Support Modal
	 */
	openSupportModal() {
		this.setState({ isSupportModal: true });
	}

	/**
	 * On Close Support Page
	 */
	onCloseSupportPage() {
		this.setState({ isSupportModal: false });
	}

	/**
	 * On Submit Support Page
	 */
	onSubmitSupport() {
		this.setState({ isSupportModal: false });
		NotificationManager.success('Message has been sent successfully!');
	}

	render() {
		// console.log('got firebase auth : ', firebase.auth);
		return (
			<div className="top-sidebar">
				<div className="sidebar-user-block">
					<Dropdown
						isOpen={this.state.userDropdownMenu}
						toggle={() => this.toggleUserDropdownMenu()}
						className="rct-dropdown"
					>
						<DropdownToggle
							tag="div"
							className="d-flex align-items-center"
						>
							<div className="user-profile">
								<img
									src={require('Assets/avatars/profile.jpg')}
									alt="user profile"
									className="img-fluid rounded-circle"
									width="50"
									height="100"
								/>
							</div>
							<div className="user-info">
								<span className="user-name ml-4">{ this.props.profile.FirstName}</span>
								<i className="zmdi zmdi-chevron-down dropdown-icon mx-4"></i>
							</div>
						</DropdownToggle>
						<DropdownMenu>
							<ul className="list-unstyled mb-0">
								{/* <li className="p-15 border-bottom user-profile-top bg-primary rounded-top">
									<p className="text-white mb-0 fs-14">Lucile Beck</p>
									<span className="text-white fs-14">info@example.com</span>
								</li> */}
								{/* <li>
									<Link to={{
										pathname: '/app/users/user-profile-1',
										state: { activeTab: 0 }
									}}>
										<i className="zmdi zmdi-account text-primary mr-3"></i>
										<IntlMessages id="widgets.profile" />
									</Link>
								</li> */}
								{/* <li>
									<Link to={{
										pathname: '/app/users/user-profile-1',
										state: { activeTab: 2 }
									}}>
										<i className="zmdi zmdi-comment-text-alt text-success mr-3"></i>
										<IntlMessages id="widgets.messages" />
										<Badge color="danger" className="pull-right">3</Badge>
									</Link>
								</li> */}
								{/* <li>
									<Link to="/app/pages/feedback">
										<i className="zmdi zmdi-edit text-warning mr-3"></i>
										<IntlMessages id="sidebar.feedback" />
										<Badge color="info" className="pull-right">1</Badge>
									</Link>
								</li> */}
								<li className="border-top" onClick={this.logoutUser}>
									<a href="javascript:void(0)">
										<i className="zmdi zmdi-power text-danger mr-3"></i>
										<IntlMessages id="widgets.logOut" />
									</a>
								</li>
							</ul>
						</DropdownMenu>
					</Dropdown>
				</div>
				<div>
					<div className="user-info">
						<span className="user-name ml-4">{ this.state.companyName }</span>
					</div>
				</div>
				<SupportPage
					isOpen={this.state.isSupportModal}
					onCloseSupportPage={() => this.onCloseSupportPage()}
					onSubmit={() => this.onSubmitSupport()}
				/>
			</div>
		);
	}
}

// map state to props
const mapStateToProps = (state) => {

	return {
		settings:state.settings,
		profile:state.firebase.profile
	}
}

export default connect(mapStateToProps, {
	logoutUserFromFirebase
})(UserBlock);
