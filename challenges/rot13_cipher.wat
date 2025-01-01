(module
  (memory (export "memory") 1)

  ;; Apply the rot13 cipher to the null-terminated ASCII string in memory.
  ;;
  ;; Rot13 involves rotating alphabetical letters 13 places onwards in the
  ;; alphabet, for example, the letter "A" becomes "N".
  ;;
  ;; The program should not be case sensitive and letters outside of the
  ;; alphabet should be left alone.
  ;;
  ;; https://en.wikipedia.org/wiki/ROT13
  (func (export "rot13")
    ;; SOLVE
  )
)
