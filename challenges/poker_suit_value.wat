(module
  (memory (export "memory") 1)

  ;; Return the "suit value" of the $nth card in memory. See "Poker Notes" in
  ;; the README for a description of how cards are represented in memory.
  ;;
  ;; Hint: WebAssembly doesn't have a `u8.load` instruction but it does have
  ;; `i32.load8_u`.
  (func (export "suit") (param $n i32) (result i32)
    ;; SOLVE
  )
)
