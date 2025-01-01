(module
  (memory (export "memory") 1)

  ;; Check whether two strings are equal, where each parameter is the pointer
  ;; to the first character of a null-terminated ASCII string.
  ;; Return 1 if the strings are equal and 0 if not.
  (func (export "strcmp") (param $str1 i32) (param $str2 i32) (result i32)
    ;; SOLVE
  )
)
