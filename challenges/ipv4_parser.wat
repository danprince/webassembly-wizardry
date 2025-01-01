(module
  (memory (export "memory") 1)

  ;; Parse an ipv4 address from the string in memory and return it as an i32.
  ;; Return 0 (0.0.0.0) if it was not possible to parse an address.
  ;;
  ;; - There must be exactly 4 octets
  ;; - Each octet must be between 0 and 255
  ;; - There must be a "." between octets
  ;; - Leading zeros are not allowed for non-zero octets
  ;;
  ;; References:
  ;; - https://en.wikipedia.org/wiki/IPv4#Addressing
  (func (export "parse") (result i32)
    ;; SOLVE
  )
)
