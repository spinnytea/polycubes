module.exports = exports = {
	"env": {
		"node": true,
		"es6": true
	},
	"extends": "eslint:recommended",
	"rules": {
        "no-console": ["error", { allow: ["info", "warn", "error"] }]
	}
};
