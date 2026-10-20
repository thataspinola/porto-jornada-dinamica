const formatCurrency = (val: string): string => {
	const match = val.match(/\.(\d*)/)
	const decimals = match ? match[1].length : undefined
	let numeric = val.replace(/\D/g, '')

	if (decimals === 1) {
		numeric = `${val.replace(/\D/g, '')}0`
	}

	if (decimals === undefined) {
		numeric = `${val.replace(/\D/g, '')}00`
	}

	const floatValue = (parseInt(numeric || '0.00', 10) / 100).toFixed(2)
	return floatValue.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export default formatCurrency
