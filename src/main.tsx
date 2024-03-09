import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import styles from "./main.module.css";


// Param Props & State
type TypesOfParam = 'string' | 'list_string';
type ColorLiteral = 'red' | 'green' | 'blue';

interface Color {
	paramId: number;
	color: ColorLiteral
}

interface Param {
	id: number;
	name: string;
	type: TypesOfParam;
}

interface ParamValue {
	paramId: number;
	value: string | string[]; // if we want to add list[]
}

interface Model {
	paramValues: ParamValue[];
	colors: Color[];
}

interface Props {
	params: Param[];
	model: Model;
}

interface State {
	paramValues: ParamValue[];
}

interface ParamInputProps {
	param: Param;
	value: string;
	onChange: (value: string, type: TypesOfParam) => void;
}

interface ParamInputState {
	isEdited: boolean;
}
// single param component
class ParamInput extends React.Component<ParamInputProps, ParamInputState> {

	constructor(props: ParamInputProps) {
		super(props);
		this.state = {
			isEdited: false,
		}
	}

	handleEditBtnClick = () => {
		// reversing state
		this.setState(prevState => ({
			isEdited: !prevState.isEdited,
		}));
	}

	render() {
		
		const btnText = this.state.isEdited ? 'сохранить' : 'редактировать';

		return (
			<div className={styles.paramWrapper}>
				<label>{this.props.param.name}</label>
				{this.state.isEdited ? (
					<input 
						type="text"
						value={this.props.value}
						onChange={(e) => this.props.onChange(e.target.value, this.props.param.type)}
					/>
				)	:	(
					<p>
						{this.props.value}
					</p>
				)}
				<button
					onClick={this.handleEditBtnClick}
				>{btnText}</button>
			</div>
		)
	}
}



// main component wrapper
class ParamEditor extends React.Component<Props, State> {
	
	constructor(props: Props) {
		super(props);
		this.state = {
			paramValues: this.props.model.paramValues
		}
	}

	private handleParamChange = (paramId: number, newValue: string, paramType: TypesOfParam) => {
		// string param change
		if (paramType === 'string') {
			this.setState(prevState => ({
				paramValues: prevState.paramValues.map(parVal => {
					// нашли нужный параметр
					if (parVal.paramId === paramId) {
						return { 
							...parVal,
							value: newValue,
						}
					} else {
						return parVal;
					}
				})
			}));
		}
		// list value param changing
		else if (paramType === 'list_string') {
			// нам нужно сохранить разделитель при вводе новых значений
			// чтобы всё работало корректно
			const valueAsArray = newValue.split(' ');

			this.setState(prevState => ({
				paramValues: prevState.paramValues.map(parVal => {
					if (parVal.paramId === paramId) {
						return {
							...parVal,
							value: valueAsArray
						}
					}
					else {
						return parVal;
					}
				})
			}))
		}
	}

	// render array of params
	private renderParams() {
		
		return this.props.params.map(param => {

			let value = this.state.paramValues.find(paramValue => paramValue.paramId === param.id)?.value || '';
			
			// if value is list
			if (param.type === 'list_string' && Array.isArray(value)) {
				// join
				value = value.join(' ');
			}
			
			return (
				<ParamInput 
					key={param.id} 
					value={value as string}
					onChange={(newValue, paramType) => this.handleParamChange(param.id, newValue, paramType)}
					param={param}
				/>
			);
		});
	}

	public getModel(): Model {
		return {
			paramValues: this.state.paramValues,
			colors: this.props.model.colors,
		}
	}

	render() {
		return (
			<div>
				{this.renderParams()}
			</div>
		)
	}
}




// rendering

const mockDataToEditor: Props = {
	model: {
		"paramValues": [
			{
				paramId: 1,
				value: "повседневное"
			},
			{
				paramId: 2,
				value: "макси"
			},
			{
				paramId: 3,
				value: ['capt', 'slept', 'dept', 'rang', 'nept']
			}
		],
		"colors": [
			{
				paramId: 1,
				color: 'blue',
			},
			{
				paramId: 2,
				color: 'green',
			},
			{
				paramId: 3,
				color: 'red',
			},

		]
	},
	params: [
		{
			id: 1,
			name: "Назначение",
			type: 'string',
		},
		{
			id: 2,
			name: "Длина",
			type: 'string'
		},
		{
			id: 3,
			name: "Лист",
			type: 'list_string'
		}
	]
}

function App() {
	return (
		<main>
			<ParamEditor 
				{...mockDataToEditor}
			/>
		</main>
	)
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
