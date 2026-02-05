module.exports = {

"[project]/.next-internal/server/app/contrate/[[...slug]]/page/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/context/clientStore.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "useJourneyStore": ()=>useJourneyStore
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-rsc] (ecmascript)");
;
const useJourneyStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        data: {},
        hydrate: (journey)=>{
            try {
                const raw = localStorage.getItem(`journey:${journey}:data`);
                const json = raw ? JSON.parse(raw) : {};
                set({
                    data: {
                        ...get().data,
                        [journey]: json
                    }
                });
            } catch  {
                console.error(`Error hydrating journey ${journey}`);
            }
        },
        setValue: (journey, field, value)=>{
            try {
                const oldJourneyData = get().data[journey] || {};
                const currentJourneyData = {
                    ...oldJourneyData,
                    [journey]: value
                };
                set({
                    data: {
                        ...get().data,
                        [journey]: currentJourneyData
                    }
                });
                localStorage.setItem(`jorney:${journey}:data`, JSON.stringify(currentJourneyData));
            } catch  {
                console.error(`Error setting value for field ${field} in journey ${journey}`);
            }
        },
        setMany (journey, obj) {
            try {
                const oldJourneyData = get().data[journey] || {};
                const currentJourneyData = {
                    ...oldJourneyData,
                    [journey]: obj
                };
                set({
                    data: {
                        ...get().data,
                        [journey]: currentJourneyData
                    }
                });
                localStorage.setItem(`Jorney:${journey}:data`, JSON.stringify(currentJourneyData));
            } catch  {
                console.error(`Error setting values for jorney ${journey}`);
            }
        },
        clear (journey) {
            try {
                const journeis = {
                    ...get().data
                };
                delete journeis[journey];
                set({
                    data: journeis
                });
                localStorage.removeItem(`journey:${journey}:data`);
            } catch  {
                console.error(`Error clearing journey ${journey}`);
            }
        }
    }));
}),
"[project]/src/service/registry.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "asyncActionsRegistry": ()=>asyncActionsRegistry
});
const asyncActionsRegistry = {
    "consultar-elegibilidade-vida": async (value)=>{
        const response = await fetch(`/api/elegibilidade?cpf=${value}`);
        if (!response.ok) throw new Error("CPF não elegível");
        return response.json();
    },
    "buscar-cep": async (cep)=>{
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        return response.json();
    }
};
}),
"[project]/src/components/Elements/Button.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "ButtonElement": ()=>ButtonElement
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@porto/js-library-corp-hubv-porto-ocean'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const ButtonElement = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/Elements/Button.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/Elements/CEP.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "CepElement": ()=>CepElement
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@porto/js-library-corp-hubv-porto-ocean'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const CepElement = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {}, void 0, false, {
                fileName: "[project]/src/components/Elements/CEP.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Typography, {
                children: "Não sei o CEP"
            }, void 0, false, {
                fileName: "[project]/src/components/Elements/CEP.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Elements/CEP.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/Elements/CNPJ.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "CNPJElement": ()=>CNPJElement
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@porto/js-library-corp-hubv-porto-ocean'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const CNPJElement = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/Elements/CNPJ.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/Elements/CPF.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "CPFElement": ()=>CPFElement
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@porto/js-library-corp-hubv-porto-ocean'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const CPFElement = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/Elements/CPF.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/Elements/Email.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "EmailElement": ()=>EmailElement
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@porto/js-library-corp-hubv-porto-ocean'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const EmailElement = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/Elements/Email.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/Elements/Phone.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "PhoneElement": ()=>PhoneElement
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@porto/js-library-corp-hubv-porto-ocean'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const PhoneElement = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/Elements/Phone.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/Elements/Spacing.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "SpacingElement": ()=>SpacingElement
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@porto/js-library-corp-hubv-porto-ocean'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const SpacingElement = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Spacing, {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/Elements/Spacing.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/Elements/typography.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "TypographyElement": ()=>TypographyElement
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@porto/js-library-corp-hubv-porto-ocean'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const TypographyElement = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Typography, {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/Elements/typography.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/Elements/index.ts [app-rsc] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$Button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/Button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$CEP$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/CEP.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$CNPJ$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/CNPJ.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$CPF$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/CPF.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$Email$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/Email.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$Phone$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/Phone.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$Spacing$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/Spacing.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$typography$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/typography.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
}),
"[project]/src/components/Elements/index.ts [app-rsc] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$Button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/Button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$CEP$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/CEP.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$CNPJ$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/CNPJ.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$CPF$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/CPF.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$Email$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/Email.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$Phone$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/Phone.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$Spacing$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/Spacing.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$typography$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/typography.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Elements/index.ts [app-rsc] (ecmascript) <locals>");
}),
"[project]/src/components/Elements/Text.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "TextElement": ()=>TextElement
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@porto/js-library-corp-hubv-porto-ocean'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const TextElement = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/Elements/Text.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/FormElement/index.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "FormElement": ()=>FormElement
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$registry$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/registry.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/Elements/index.ts [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$Button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/Button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$typography$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/typography.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$Text$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Elements/Text.tsx [app-rsc] (ecmascript)");
;
;
;
;
const ElementRegistry = {
    typography: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$typography$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TypographyElement"],
    button: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$Button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ButtonElement"],
    text: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$Text$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TextElement"],
    cpf: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Elements$2f$Text$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TextElement"]
};
const FormElement = ({ element, value, onChange })=>{
    const Component = ElementRegistry[element.type];
    if (!Component) return null;
    // Função que lida com as ações do JSON (ex: Elegibilidade)
    const handleAsyncAction = async (currentValue)=>{
        if (!element.asyncActions) return;
        for (const action of element.asyncActions){
            try {
                const serviceFn = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$registry$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asyncActionsRegistry"][action.service];
                if (serviceFn) {
                    const result = await serviceFn(currentValue);
                    console.log("Sucesso na ação:", action.service, result);
                // Aqui você pode disparar um callback para o FormStep mudar de tela
                }
            } catch (error) {
                console.error("Erro na ação dinâmica:", error);
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
        ...element.uiProps,
        value: value,
        onChange: onChange,
        onBlur: ()=>handleAsyncAction(value)
    }, void 0, false, {
        fileName: "[project]/src/components/FormElement/index.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/FormStep/index.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "FormStep": ()=>FormStep
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FormElement$2f$index$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/FormElement/index.tsx [app-rsc] (ecmascript)");
;
;
const FormStep = ({ step, data, onChange })=>{
    const [errors, setErrors] = React.useState({});
    const validateField = (element, value)=>{
        if (element.validation?.required && !value) {
            return "Este campo é obrigatório";
        }
        if (element.validation?.pattern === "cpf" && !validarCPF(value)) {
            return "CPF inválido";
        }
        return "";
    };
    const handleChange = (id, value, element)=>{
        onChange(id, value);
        const error = validateField(element, value);
        setErrors((prev)=>({
                ...prev,
                [id]: error
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: step.elements.map((element)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FormElement$2f$index$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormElement"], {
                element: element,
                value: data[element.id],
                error: errors[element.id],
                onChange: (value)=>handleChange(element.id, value, element)
            }, element.id, false, {
                fileName: "[project]/src/components/FormStep/index.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/src/components/FormStep/index.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/Journey/index.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "Journey": ()=>Journey
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$clientStore$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/clientStore.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FormStep$2f$index$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/FormStep/index.tsx [app-rsc] (ecmascript)");
;
;
;
;
const Journey = ({ config, initialData, slug })=>{
    const journey = config.slug;
    const hydrate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$clientStore$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useJourneyStore"])((state)=>state.hydrate);
    const setValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$clientStore$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useJourneyStore"])((state)=>state.setValue);
    const setMany = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$clientStore$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useJourneyStore"])((state)=>state.setMany);
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$clientStore$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useJourneyStore"])((state)=>state.data[journey] || {});
    const step = config.steps.find((step)=>step.slug === slug);
    const onChange = (id, value)=>setValue(journey, id, value);
    function loadInitialData() {
        if (!initialData) return;
        if (!Object.keys(initialData).length) return;
        setMany(journey, initialData);
    }
    if (!step) return null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        hydrate(journey);
    }, [
        journey,
        hydrate
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadInitialData();
    }, [
        journey,
        initialData,
        setMany
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FormStep$2f$index$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormStep"], {
        config: config,
        data: data,
        step: step,
        onChange: onChange
    }, void 0, false, {
        fileName: "[project]/src/components/Journey/index.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/index.ts [app-rsc] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Journey$2f$index$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Journey/index.tsx [app-rsc] (ecmascript)");
;
}),
"[project]/src/components/index.ts [app-rsc] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Journey$2f$index$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Journey/index.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/index.ts [app-rsc] (ecmascript) <locals>");
}),
"[project]/src/mock/journeyMock.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "journeis": ()=>journeis,
    "journeyWithMultipleStepMock": ()=>journeyWithMultipleStepMock,
    "journeyWithSingleStepMock": ()=>journeyWithSingleStepMock
});
const journeyWithSingleStepMock = {
    slug: "equipamentos",
    title: "Equipamentos Portateis",
    steps: [
        {
            title: "Dados do equipamento",
            subtitle: "Selecione o equipamento que deseja fazer o seguro",
            slug: "dados-do-equipamentos",
            path: "/loja/equipamentos/dados-do-equipamento",
            kind: "form",
            seo: {
                title: "Dados do equipamentos",
                description: "Informe tipo do equipamento, marca e modelo",
                canonical: "/loja/equipamentos/dados-do-equipamento"
            },
            elements: [
                {
                    id: "tipo",
                    label: "Tipo do equipamento",
                    type: "select",
                    required: true,
                    options: [
                        {
                            label: "Celular",
                            value: "celular"
                        },
                        {
                            label: "Notebook",
                            value: "notebook"
                        },
                        {
                            label: "Tablet",
                            value: "tablet"
                        }
                    ]
                },
                {
                    id: "marca",
                    label: "Marca do equipamento",
                    type: "select",
                    required: true,
                    options: [
                        {
                            label: "Apple",
                            value: "apple"
                        },
                        {
                            label: "Motorola",
                            value: "motorola"
                        },
                        {
                            label: "Xiaomi",
                            value: "xiaomi"
                        }
                    ]
                },
                {
                    id: "modelo",
                    label: "Modelo",
                    type: "text",
                    required: true
                }
            ],
            link: {
                back: "",
                next: ""
            },
            validators: []
        }
    ]
};
const journeyWithMultipleStepMock = {
    slug: "equipamentos",
    title: "Equipamentos Portáteis",
    steps: [
        {
            title: "Dados do equipamento",
            subtitle: "Selecione o equipamento que deseja fazer o seguro",
            slug: "dados-do-equipamentos",
            path: "/loja/equipamentos/dados-do-equipamento",
            kind: "form",
            seo: {
                title: "Dados do equipamentos",
                description: "Informe tipo do equipamento, marca e modelo",
                canonical: "/loja/equipamentos/dados-do-equipamento"
            },
            elements: [
                {
                    id: "tipo",
                    type: "select",
                    validation: {
                        required: true
                    },
                    uiProps: {
                        label: "Tipo do equipamento",
                        placeholder: "Selecione o tipo",
                        options: [
                            {
                                label: "Celular",
                                value: "celular"
                            },
                            {
                                label: "Notebook",
                                value: "notebook"
                            },
                            {
                                label: "Tablet",
                                value: "tablet"
                            }
                        ]
                    }
                },
                {
                    id: "marca",
                    type: "select",
                    validation: {
                        required: true
                    },
                    uiProps: {
                        label: "Marca do equipamento",
                        placeholder: "Selecione a marca",
                        options: [
                            {
                                label: "Apple",
                                value: "apple"
                            },
                            {
                                label: "Motorola",
                                value: "motorola"
                            },
                            {
                                label: "Xiaomi",
                                value: "xiaomi"
                            }
                        ]
                    }
                },
                {
                    id: "modelo",
                    type: "text",
                    validation: {
                        required: true
                    },
                    uiProps: {
                        label: "Modelo",
                        placeholder: "Digite o modelo"
                    }
                }
            ],
            link: {
                back: "",
                next: ""
            },
            validators: []
        },
        {
            title: "Dados do usuário",
            subtitle: "Insira seus dados principais",
            slug: "dados-do-usuario",
            path: "/loja/equipamentos/dados-do-usuario",
            kind: "longform",
            seo: {
                title: "Dados do usuário",
                description: "Informe CPF, telefone e data de nascimento",
                canonical: "/loja/equipamentos/dados-do-usuario"
            },
            elements: [
                {
                    id: "Title",
                    type: "typography",
                    uiProps: {
                        variant: "h3",
                        children: "Identificação"
                    }
                },
                {
                    id: "cpf",
                    type: "cpf",
                    validation: {
                        required: true,
                        pattern: "cpf"
                    },
                    uiProps: {
                        label: "CPF",
                        placeholder: "000.000.000-00"
                    }
                },
                {
                    id: "telefone",
                    type: "phone",
                    validation: {
                        required: true
                    },
                    uiProps: {
                        label: "Telefone",
                        placeholder: "(11) 99999-9999"
                    }
                },
                {
                    id: "modelo_confirmacao",
                    type: "text",
                    validation: {
                        required: true
                    },
                    uiProps: {
                        label: "Confirme o modelo"
                    }
                }
            ],
            link: {
                back: "",
                next: ""
            },
            validators: []
        }
    ]
};
const journeis = {
    'financiamento-de-veiculos': {
        "meta": {
            "journeyId": "financiamento-porto",
            "tenant": "porto-bank"
        },
        "seo": {
            "title": "Simulador de Financiamento | Porto Bank",
            "description": "Simule seu financiamento de veículo de forma rápida e segura com a Porto.",
            "slug": "simulador-veiculos",
            "canonical": "https://www.porto.com.br/financiamento-veiculos",
            "index": true
        },
        "steps": [
            {
                "id": "step_1_identificacao",
                "slug": "identificacao",
                "title": "Identificação",
                "elements": [
                    {
                        "id": "txt_intro",
                        "component": "typography",
                        "props": {
                            "variant": "h2",
                            "children": "Vamos começar?",
                            "align": "left"
                        }
                    },
                    {
                        "id": "txt_sub",
                        "component": "typography",
                        "props": {
                            "variant": "body1",
                            "children": "Informe seu CPF para verificarmos ofertas pré-aprovadas."
                        }
                    },
                    {
                        "id": "cpf_input",
                        "component": "cpf",
                        "props": {
                            "label": "Digite seu CPF",
                            "placeholder": "000.000.000-00",
                            "name": "documento"
                        },
                        "rules": [
                            {
                                "type": "required",
                                "message": "O CPF é obrigatório para a simulação."
                            },
                            {
                                "type": "cpf",
                                "message": "Este CPF não parece válido."
                            }
                        ]
                    },
                    {
                        "id": "btn_next_1",
                        "component": "button",
                        "props": {
                            "children": "Continuar",
                            "variant": "primary",
                            "fullWidth": true
                        },
                        "action": {
                            "type": "SUBMIT",
                            "url": "/api/v1/finance/check-eligibility",
                            "method": "POST",
                            "onSuccess": {
                                "type": "NAVIGATE_NEXT"
                            },
                            "onError": {
                                "type": "SHOW_MODAL",
                                "props": {
                                    "title": "Aviso",
                                    "text": "Infelizmente não encontramos ofertas para este CPF."
                                }
                            }
                        }
                    }
                ]
            },
            {
                "id": "step_2_veiculo",
                "slug": "dados-veiculo",
                "title": "Sobre o Veículo",
                "elements": [
                    {
                        "id": "placa_input",
                        "component": "text",
                        "props": {
                            "label": "Placa do Veículo (Opcional)",
                            "placeholder": "AAA-0000",
                            "mask": "AAA-0X00",
                            "name": "placa"
                        },
                        "rules": [
                            {
                                "type": "regex",
                                "value": "^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$",
                                "message": "Placa fora do padrão Mercosul/Brasil."
                            }
                        ]
                    },
                    {
                        "id": "sabe_modelo_radio",
                        "component": "radio",
                        "props": {
                            "label": "Já sabe o modelo?",
                            "name": "knows_model",
                            "options": [
                                {
                                    "label": "Sim",
                                    "value": "S"
                                },
                                {
                                    "label": "Não",
                                    "value": "N"
                                }
                            ]
                        },
                        "rules": [
                            {
                                "type": "required",
                                "message": "Selecione uma opção."
                            }
                        ]
                    },
                    {
                        "id": "marca_select",
                        "component": "select",
                        "props": {
                            "label": "Marca",
                            "name": "marca",
                            "options": [
                                {
                                    "label": "Toyota",
                                    "value": "toyota"
                                },
                                {
                                    "label": "Honda",
                                    "value": "honda"
                                }
                            ]
                        },
                        "rules": [
                            {
                                "type": "conditional",
                                "condition": {
                                    "field": "sabe_modelo_radio",
                                    "value": "S"
                                },
                                "rule": {
                                    "type": "required",
                                    "message": "Selecione a marca."
                                }
                            }
                        ]
                    },
                    {
                        "id": "btn_next_2",
                        "component": "button",
                        "props": {
                            "children": "Próximo Passo",
                            "variant": "primary"
                        },
                        "action": {
                            "type": "NAVIGATE_NEXT"
                        }
                    }
                ]
            },
            {
                "id": "step_3_pessoais",
                "slug": "dados-pessoais",
                "title": "Dados Pessoais",
                "elements": [
                    {
                        "id": "nome_input",
                        "component": "text",
                        "props": {
                            "label": "Nome Completo",
                            "name": "nome_completo"
                        },
                        "rules": [
                            {
                                "type": "required",
                                "message": "Precisamos do seu nome."
                            },
                            {
                                "type": "minLength",
                                "value": 10,
                                "message": "Por favor, digite o nome completo."
                            }
                        ]
                    },
                    {
                        "id": "renda_input",
                        "component": "currency",
                        "props": {
                            "label": "Renda Mensal Estimada",
                            "name": "renda",
                            "prefix": "R$"
                        },
                        "rules": [
                            {
                                "type": "required",
                                "message": "A renda é necessária para o cálculo de parcelas."
                            },
                            {
                                "type": "min",
                                "value": 1200,
                                "message": "Renda mínima para simulação é R$ 1.200."
                            }
                        ]
                    },
                    {
                        "id": "email_input",
                        "component": "email",
                        "props": {
                            "label": "E-mail para contato",
                            "name": "email"
                        },
                        "rules": [
                            {
                                "type": "required",
                                "message": "O e-mail é obrigatório."
                            },
                            {
                                "type": "email",
                                "message": "E-mail inválido."
                            }
                        ]
                    },
                    {
                        "id": "btn_submit_lead",
                        "component": "button",
                        "props": {
                            "children": "Finalizar Simulação",
                            "variant": "primary"
                        },
                        "action": {
                            "type": "SUBMIT_FINAL",
                            "url": "/api/v1/finance/capture-lead",
                            "method": "POST",
                            "onSuccess": {
                                "type": "REDIRECT_EXTERNAL",
                                "url": "https://porto.com.br/obrigado?leadId={{id}}"
                            },
                            "onError": {
                                "type": "SHOW_MODAL",
                                "props": {
                                    "title": "Erro",
                                    "text": "Houve um problema ao salvar seus dados. Tente novamente."
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
};
}),
"[project]/src/service/getJourneyService.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "getJourneyConfig": ()=>getJourneyConfig
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$mock$2f$journeyMock$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/mock/journeyMock.ts [app-rsc] (ecmascript)");
;
const mockCmsService = (slug)=>{
    const currentSlug = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$mock$2f$journeyMock$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["journeis"][slug];
    if (!currentSlug) return null;
    return currentSlug;
};
async function getJourneyConfig(slug) {
    const response = mockCmsService(slug);
    // const response = await fetch(`https://api.seucms.com/v1/journey/${slug}`, {
    //   next: { revalidate: 3600 },
    // });
    if (!response) {
        throw new Error('Jornada não encontrada');
    }
    return response;
}
}),
"[project]/src/app/contrate/[[...slug]]/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>SlugPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/index.ts [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Journey$2f$index$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Journey/index.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$getJourneyService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/getJourneyService.ts [app-rsc] (ecmascript)");
;
;
;
async function SlugPage({ params }) {
    const currentSlug = params.slug;
    const config = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$getJourneyService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getJourneyConfig"])(currentSlug);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Journey$2f$index$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Journey"], {
        config: config,
        slug: currentSlug
    }, void 0, false, {
        fileName: "[project]/src/app/contrate/[[...slug]]/page.tsx",
        lineNumber: 20,
        columnNumber: 11
    }, this);
}
}),
"[project]/src/app/contrate/[[...slug]]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/contrate/[[...slug]]/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__98baef28._.js.map