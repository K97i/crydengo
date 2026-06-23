const automodSchema = {
    "type": "object",
    "properties": {
        "cryptoImages": {
            "type": "object",
            "properties": {
                "block": {
                    "type": "boolean"
                },
                "action": {
                    "type": "string",
                    "enum": ["timeout", "ban", "block", "none"]
                },
                "duration": {
                    "type": "integer",
                    "minimum": 1
                },
                "keywords": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "minItems": 1,
                    "uniqueItems": true
                },
                "threshold": {
                    "type": "integer",
                    "minimum": 1
                }
            },
            "required": [
                "block",
                "action",
                "duration",
                "keywords",
                "threshold"
            ],
            "additionalProperties": false
        },
        "r18Invites": {
            "type": "object",
            "properties": {
                "block": {
                    "type": "boolean"
                },
                "action": {
                    "type": "string",
                    "enum": ["timeout", "ban", "block", "none"]
                },
                "duration": {
                    "type": "integer",
                    "minimum": 1
                },
                "keywords": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "minItems": 1,
                    "uniqueItems": true
                },
                "threshold": {
                    "type": "integer",
                    "minimum": 1
                }
            },
            "required": [
                "block",
                "action",
                "duration",
                "keywords",
                "threshold"
            ],
            "additionalProperties": false
        }
    },
    "required": ["cryptoImages", "r18Invites"],
    "additionalProperties": false
}

const generalSchema = {
    "type": "object",
    "properties": {
        "loggingChannel": {
            "type": "string",
        },
        "adminRoles": {
            "type": "array",
            "items": {
                "type": "string",
            },
            "uniqueItems": true
        }
    },
    "required": ["loggingChannel", "adminRoles"],
    "additionalProperties": false
}

const regexSchema = {
    "type": "object",
    "properties": {
        "enhancedRegex": {
            "type": "boolean"
        },
        "regexList": {
            "type": "array",
            "items": {
            "type": "object",
            "properties": {
                "regex": {
                "type": "string",
                },
                "action": {
                "type": "string",
                "enum": ["block", "timeout", "delete", "warn", "none"]
                },
                "duration": {
                "type": "integer",
                "minimum": 1
                }
            },
            "required": ["regex", "action"],
            "additionalProperties": false
            },
        }
    },
    "required": ["enhancedRegex", "regexList"],
    "additionalProperties": false
}

module.exports = { automodSchema, generalSchema, regexSchema };