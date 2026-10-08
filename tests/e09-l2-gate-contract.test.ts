import contract from "../automation/e09-l2-gate-contract.json";

function assert(x:boolean,m:string){if(!x)throw new Error(m)}

const r=contract.e10UnlockRule;
assert(r.clientOverrideAllowed===false,"client override must be disabled");
assert(r.chatOverrideAllowed===false,"chat override must be disabled");
assert(r.syntheticFixtureOverrideAllowed===false,"synthetic fixture override must be disabled");
assert(r.adminBypassAllowed===false,"admin bypass must be disabled");
assert(r.conditions.length===5,"E-10 must require all authoritative E-09 conditions");

console.log("E-09 L2 gate contract PASS: no bypass paths defined");
