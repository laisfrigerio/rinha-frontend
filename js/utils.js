const isObjectNode = (node) => typeof node === "object"

const isStringNode = (node) => typeof node === "string"

const isOpenCloseChar = (char) => ["{", "}", "[", "]"].includes(char)

const isFalsyChar = (char) => char === false

const isNotNumberChar = (char) => isNaN(Number(char))

const createHtmlElement = (tag) => document.createElement(tag)

const isArrayOrObject = (value) => Array.isArray(value) ? "array" : "object"
