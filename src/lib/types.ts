export type Score = {
    puzzle: number
    name: string 
    score: number
    emojis: string[]
}

export type ParseResult = 
    | { ok: true; value: Score }
    | { ok: false; error: string }  
