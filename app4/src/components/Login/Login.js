import React, { useState, useEffect, useReducer, useContext } from "react"

import Card from "../UI/Card/Card"
import classes from "./Login.module.css"
import Button from "../UI/Button/Button"
import AuthContext from "../../context/auth-context"

/* created outside the component function */
const emailReducerFunction = (state, action) => {
	if (action.type === 'USER_INPUT') {
			return { value: action.val, isValid: action.val.includes('@') };
	}
	if (action.type === 'INPUT_BLUR') {
		return { value: state.value, isValid: state.value.includes('@') };
	}
	return { value: "", isValid: false }
}

const passwordReducerFunction = (state, action) => {
	if (action.type === "USER_INPUT") {
		return { value: action.val, isValid: action.val.trim().length > 6 }
	}
	if (action.type === "INPUT_BLUR") {
		return { value: state.value, isValid: state.value.trim().length > 6 }
	}
	return { value: "", isValid: false }
}


const Login = (props) => {
	const [formIsValid, setFormIsValid] = useState(false)

	/* calling the useReducer that returns an array with two elements (first argument is a function) adding the initial values */
	const [emailState, dispatchEmail] = useReducer(emailReducerFunction, {
		value: "",
		isValid: null,
	})

	const [passwordState, dispatchPassword] = useReducer(passwordReducerFunction, {
		value: "",
		isValid: null,
	})

	const authCtx = useContext(AuthContext)

	/* the optimal way of updating state:
	object destructuring with alias assignment: pulling out a value of isValid and storing it inside alias (emailIsValid or passwordIsValid) */
	const { isValid: emailIsValid } = emailState
	const { isValid: passwordIsValid } = passwordState
	/* when just the value changes, while validity does not, useEffect() will not rerun (once it reaches the valid point) */

	useEffect(() => {
		const identifier = setTimeout(() => {
			setFormIsValid(emailIsValid && passwordIsValid)
		}, 500)

		return () => {
			clearTimeout(identifier)
		}
	}, [emailIsValid, passwordIsValid]) /* dependancies */

	const emailChangeHandler = (event) => {
		dispatchEmail({
			type: "USER_INPUT",
			val: event.target.value,
		})
	}

	const passwordChangeHandler = (event) => {
		dispatchPassword({ type: "USER_INPUT", val: event.target.value })
	}

	const validateEmailHandler = () => {
		dispatchEmail({ type: "INPUT_BLUR" })
	}

	const validatePasswordHandler = () => {
		dispatchPassword({ type: "INPUT_BLUR" })
	}

	const submitHandler = (event) => {
		event.preventDefault()
		authCtx.onLogin(emailState.value, passwordState.value)
	}

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<div
					className={`${classes.control} ${
						emailState.isValid === false ? classes.invalid : ""
					}`}
				>
					<label htmlFor='email'>E-Mail</label>
					<input
						type='email'
						id='email'
						value={emailState.value}
						onChange={emailChangeHandler}
						onBlur={validateEmailHandler}
					/>
				</div>
				<div
					className={`${classes.control} ${
						passwordState.isValid === false ? classes.invalid : ""
					}`}
				>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						id='password'
						value={passwordState.value}
						onChange={passwordChangeHandler}
						onBlur={validatePasswordHandler}
					/>
				</div>
				<div className={classes.actions}>
					<Button type='submit' className={classes.btn} disabled={!formIsValid}>
						Login
					</Button>
				</div>
			</form>
		</Card>
	)
}

export default Login
