function padString(params: { value: string; padStart?: string; padEnd?: string }) {
	let { value, padStart, padEnd } = params;

	if (padStart) value = `${padStart} ${value}`;
	if (padEnd) value = `${value} ${padEnd}`;

	return value;
}

export function eth2usdt(eth?: string, price?: string) {
	if (!eth || !price) return "0";

	return fullNumber(Number(eth) * Number(price));
}

export function getStringAndNumber(value: number | string): [string, number] {
	return [fullNumber(value), Number(value)];
}

export function fullNumber(value?: string | number, exact?: boolean) {
	if (value === 0) {
		return "0";
	} else if (typeof value === "number" && isNaN(value)) {
		return "NaN";
	} else if (!value) {
		return "null";
	}

	const valueStr = String(value);

	if (!/e/i.test(valueStr)) return valueStr;

	const strArr = valueStr.split(/[.\e]/);
	let integer = "",
		decimal = "",
		power = "";

	if (strArr.length === 3) {
		[integer, decimal, power] = strArr;
	} else {
		[integer, power] = strArr;
	}

	const powerNum = Number(power);

	if (powerNum > 0) {
		return `${integer}${decimal}${"0".repeat(Math.abs(powerNum) - decimal.length)}`;
	} else {
		return `0.${"0".repeat(Math.abs(powerNum) - integer.length)}${integer}${decimal ?? ""}`;
	}
}

export function formatBignumber(params: {
	value?: number | string;
	padStart?: string;
	padEnd?: string;
	fill?: string;
}) {
	const { value, padStart, padEnd, fill = "-" } = params;

	if (Number(value) === 0) return 0;

	if (!value) return fill;

	const [_, numValue] = getStringAndNumber(value);

	let num: number = 0,
		unit = "";

	if (numValue >= 10e10) {
		num = Number((numValue / 10e9).toFixed(1));
		unit = "B";
	} else if (numValue >= 10e7) {
		num = Number((numValue / 10e6).toFixed(1));
		unit = "M";
	} else if (numValue >= 10e4) {
		num = Number((numValue / 10e3).toFixed(1));
		unit = "K";
	}

	return padString({ value: num + unit, padStart, padEnd });
}

export function formatSmallNumber(value?: number | string) {
	if (Number(value) === 0) return "0";

	if (!value) return "-";

	const [strValue, numValue] = getStringAndNumber(value);

	if (numValue > 1e-6) return Number(strValue.substring(0, 8)).toString();

	return strValue.replace("0.", "").replace(/0+$/, str => `0.0[${str.length}]`);
}

export function formatDelimiter(value?: number | string | null, fill: string = "-", fractionDigits?: number) {
	if (value !== null && Number(value) === 0) return "0";

	if (!value) return fill;

	const [strValue, numValue] = getStringAndNumber(value);
	const index = strValue.indexOf(".");

	const str = index < 0 ? strValue : strValue.substring(0, index + 1 + (fractionDigits ?? 2));

	if (numValue < 1e3) return Number(str).toString();

	return Number(str).toLocaleString();
}

export function formatNumber(value?: number | string | null, fill: string = "-") {
	if (value !== null && Number(value) === 0) return "0";

	if (!value) return fill;

	const [_, numValue] = getStringAndNumber(value);

	if (Math.abs(numValue) > 0.1) return formatDelimiter(numValue);
	else return formatSmallNumber(numValue);
}
