(module
  (memory (export "memory") 1)

  ;; Search for the first instance of $c within the null-terminated ASCII
  ;; string in memory and return the index of the match. If the character
  ;; was not present in the string, return -1.
  (func (export "strchr") (param $c i32) (result i32)
    ;; SOLVE
  )
)

