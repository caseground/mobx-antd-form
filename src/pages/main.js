import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Form, Input } from 'antd';
import stores from '../store';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { observer, inject } from 'mobx-react';
import './index.css';


const form = Form.create({
    mapPropsToFields(props) {
        console.log('mapPropsToFields');
        return {
            name: Form.createFormField({
                value: props.test.person.name
            })
        };
    },
    onFieldsChange(props, changedFields) {
        console.log('changedFields', changedFields);
    }
});

const mockForm = function(WrappedComponent) {
    // return WrappedComponent;
    class MockForm extends React.Component {
        render() {
            // let { children, ...others } = this.props;
            // let formProps = {form: null};
            // let props = Object.assign({}, formProps, others);
            return <WrappedComponent {...this.props} />;
        }
    }
    return MockForm;
    // return hoistNonReactStatic(MockForm, WrappedComponent);
};

const fieldStore = {
    name: { value: '' }
}

const mockInput = function(name) {

    return (FormElement) => {
        
        return React.cloneElement(FormElement, fieldStore[name]);
    }
}

@inject(({ test }) => ({ test }))
@form
@observer
class PersonTest extends React.Component {
    handleInputChange = (e) => {
        console.log(e.currentTarget.value);
        this.props.test.updatePersonName(e.currentTarget.value);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        console.log('render PersonTest', this.props);
        let { person } = this.props.test;
        let name = person.name || '';

        return (
            <div>
                <div>{name}</div>
                {
                    getFieldDecorator('name')(<Input />)
                }
                {
                    mockInput('name')(<Input onChange={this.handleInputChange} />)
                }
            </div>
        );
    }
}

@inject(({ test }) => ({ test }))
@observer
class Test extends React.Component {
    render() {
        const { updatePersonName } = this.props.test;
        console.log('render Test');

        return (
            <div>
                <div onClick={updatePersonName}>updatePersonName</div>
                <PersonTest />
            </div>
        );
    }
    componentDidMount() {
        this.props.test.updatePersonNameAsync();
    }
}

ReactDOM.render(
    <Provider {...stores}>
        <Test />
    </Provider>,
    document.body.querySelector('.app')
);
