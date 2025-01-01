(module
  (memory (export "memory") 1)

  ;; Parse a signed floating point number from decimal in the first ASCII
  ;; string in memory and return it.
  ;;
  ;; Unlike with integers, you'll need to handle signs and fractional components.
  ;;
  ;; For this challenge, valid floats all have the following pattern: -?[0-9]*\.[0-9]+
  ;;
  ;; That is:
  ;; - An optional minus sign
  ;; - Zero or more digits
  ;; - A decimal point
  ;; - One or more digits
  ;;
  ;; If the string does not match this pattern, return 0.
  (func (export "parse") (result f32)
    ;; SOLVE
  )
)
