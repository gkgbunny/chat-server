import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { TextField, Button, Typography, TableBody } from '@material-ui/core';
import CreateUser from '../pages/components/CreateUser';
import { SnackBarProvider } from '../pages/SnackBarProvider';
import sinon from 'sinon';
import TableComponent from '../pages/components/TableComponent';


const spy = sinon.spy();
describe('CreateUser component unit test', () => {
  let props = {
		data: {
			getAllUser: [{id: 7, name: 'ajay', email: 'ajay@gmail.com'}],
		},
		onSelect: spy,
		loginData: ['7','ajay','ajay@gmail.com'],
	};
	// beforeEach(() => {
	// 	defaultProps = {
	// 		open: false,

	// 	}
	// })

	test('renders without an error', () => {
		const wrapper = shallow(<CreateUser />);
		expect(wrapper.exists()).toBe(true);
	})

  
	it('should render a <TextField />', () => {
		const wrapper = shallow(<CreateUser />);
    expect(wrapper.find(TextField)).toHaveLength(2);
	});
  
	it('should render a <Typography />', () => {
		const wrapper = shallow(<CreateUser />);
    expect(wrapper.find(Typography)).toHaveLength(0);
	});
  
	it('should render a <Button />', () => {
		const wrapper = shallow(<CreateUser />);
    expect(wrapper.find(Button)).toHaveLength(2);
	});
  
	it('render correctly  Tablecomponent', () => {  
		const wrapper = shallow(<TableComponent />);
		expect(wrapper.find(TableComponent)).toMatchSnapshot();
	});

  it('props validation', () => {
    const wrapper = shallow(<SnackBarProvider />)
		// expect(wrapper.props().children).exists();
		expect(wrapper).toMatchSnapshot();
	});

	it('Tablecomponent props validation', () => {  
		const wrapper = mount(<TableComponent><TableBody {...props}></TableBody></TableComponent>);
		expect(wrapper.find("span")).toHaveLength(1);
	});
	
	it('Tablecomponent function validation', () => { 
		const wrapper = shallow(<TableComponent {...props}/>);
		// wrapper.setProps({
		// 	data: [{}],
		// 	onSelect: spy,
		// });
		// const event = {
		// 	target: { onClick: spy }
		// }
		wrapper.find("TableCell").at(0).simulate("click");
		expect(spy.called).toBe(true);
	});
})
