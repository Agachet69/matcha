import { useEffect } from "react"

const printVarsHook = (value, title = "") => {
	useEffect(() => {
		console.log(title, value)
	}, [value])
}

export default printVarsHook