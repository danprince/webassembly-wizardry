(module
  (memory (export "memory") 1)

  ;; Return the length of the null-terminated UTF8 string in memory. Some
  ;; unicode characters are represented with multiple bytes, so we can't just
  ;; look for the null-terminator.
  ;;
  ;; Instead we have to parse and count the individual code points. The table
  ;; here is a good reference for understanding the byte representation of
  ;; individual code points: https://en.wikipedia.org/wiki/UTF-8#Description
  (func (export "strlen") (result i32)
    ;; SOLVE
  )
)
