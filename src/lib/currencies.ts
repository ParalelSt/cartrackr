export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

/** Comprehensive list of world currencies */
export const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "\u20ac", name: "Euro" },
  { code: "GBP", symbol: "\u00a3", name: "British Pound" },
  { code: "JPY", symbol: "\u00a5", name: "Japanese Yen" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "\u00a5", name: "Chinese Yuan" },
  { code: "INR", symbol: "\u20b9", name: "Indian Rupee" },
  { code: "KRW", symbol: "\u20a9", name: "South Korean Won" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso" },
  { code: "ARS", symbol: "AR$", name: "Argentine Peso" },
  { code: "CLP", symbol: "CL$", name: "Chilean Peso" },
  { code: "COP", symbol: "CO$", name: "Colombian Peso" },
  { code: "PEN", symbol: "S/", name: "Peruvian Sol" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "NGN", symbol: "\u20a6", name: "Nigerian Naira" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "GHS", symbol: "GH\u20b5", name: "Ghanaian Cedi" },
  { code: "EGP", symbol: "E\u00a3", name: "Egyptian Pound" },
  { code: "MAD", symbol: "MAD", name: "Moroccan Dirham" },
  { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "ETB", symbol: "Br", name: "Ethiopian Birr" },
  { code: "TRY", symbol: "\u20ba", name: "Turkish Lira" },
  { code: "RUB", symbol: "\u20bd", name: "Russian Ruble" },
  { code: "UAH", symbol: "\u20b4", name: "Ukrainian Hryvnia" },
  { code: "PLN", symbol: "z\u0142", name: "Polish Zloty" },
  { code: "CZK", symbol: "K\u010d", name: "Czech Koruna" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "RON", symbol: "lei", name: "Romanian Leu" },
  { code: "BGN", symbol: "лв", name: "Bulgarian Lev" },
  { code: "HRK", symbol: "kn", name: "Croatian Kuna" },
  { code: "RSD", symbol: "din", name: "Serbian Dinar" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "ISK", symbol: "kr", name: "Icelandic Krona" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "TWD", symbol: "NT$", name: "Taiwan Dollar" },
  { code: "THB", symbol: "\u0e3f", name: "Thai Baht" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "PHP", symbol: "\u20b1", name: "Philippine Peso" },
  { code: "VND", symbol: "\u20ab", name: "Vietnamese Dong" },
  { code: "PKR", symbol: "Rs", name: "Pakistani Rupee" },
  { code: "BDT", symbol: "\u09f3", name: "Bangladeshi Taka" },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee" },
  { code: "AED", symbol: "AED", name: "UAE Dirham" },
  { code: "SAR", symbol: "SAR", name: "Saudi Riyal" },
  { code: "QAR", symbol: "QAR", name: "Qatari Riyal" },
  { code: "KWD", symbol: "KD", name: "Kuwaiti Dinar" },
  { code: "BHD", symbol: "BD", name: "Bahraini Dinar" },
  { code: "OMR", symbol: "OMR", name: "Omani Rial" },
  { code: "JOD", symbol: "JD", name: "Jordanian Dinar" },
  { code: "ILS", symbol: "\u20aa", name: "Israeli Shekel" },
  { code: "IQD", symbol: "IQD", name: "Iraqi Dinar" },
  { code: "GEL", symbol: "\u20be", name: "Georgian Lari" },
  { code: "AMD", symbol: "\u058f", name: "Armenian Dram" },
  { code: "AZN", symbol: "\u20bc", name: "Azerbaijani Manat" },
  { code: "KZT", symbol: "\u20b8", name: "Kazakhstani Tenge" },
  { code: "UZS", symbol: "UZS", name: "Uzbekistani Som" },
  { code: "DZD", symbol: "DA", name: "Algerian Dinar" },
  { code: "TND", symbol: "DT", name: "Tunisian Dinar" },
  { code: "LYD", symbol: "LD", name: "Libyan Dinar" },
  { code: "XOF", symbol: "CFA", name: "West African CFA Franc" },
  { code: "XAF", symbol: "FCFA", name: "Central African CFA Franc" },
  { code: "MWK", symbol: "MK", name: "Malawian Kwacha" },
  { code: "ZMW", symbol: "ZK", name: "Zambian Kwacha" },
  { code: "BWP", symbol: "P", name: "Botswana Pula" },
  { code: "MZN", symbol: "MT", name: "Mozambican Metical" },
  { code: "AOA", symbol: "Kz", name: "Angolan Kwanza" },
  { code: "CRC", symbol: "\u20a1", name: "Costa Rican Colon" },
  { code: "GTQ", symbol: "Q", name: "Guatemalan Quetzal" },
  { code: "DOP", symbol: "RD$", name: "Dominican Peso" },
  { code: "JMD", symbol: "J$", name: "Jamaican Dollar" },
  { code: "TTD", symbol: "TT$", name: "Trinidad Dollar" },
  { code: "UYU", symbol: "$U", name: "Uruguayan Peso" },
  { code: "PYG", symbol: "\u20b2", name: "Paraguayan Guarani" },
  { code: "BOB", symbol: "Bs", name: "Bolivian Boliviano" },
  { code: "VES", symbol: "Bs.S", name: "Venezuelan Bolivar" },
];

/** Get currency info by code */
export function getCurrency(code: string): CurrencyInfo {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/** Format a number with currency symbol */
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = getCurrency(currencyCode);
  return `${currency.symbol}${amount.toFixed(2)}`;
}

/** Format with no decimals */
export function formatCurrencyShort(amount: number, currencyCode: string): string {
  const currency = getCurrency(currencyCode);
  return `${currency.symbol}${amount.toFixed(0)}`;
}
