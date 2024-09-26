(module
  (memory (export "memory") 1)

  (global $ptr (mut i32) (i32.const 0))
  (global $addr (mut i32) (i32.const 0))

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
    ;; Reset globals
    (global.set $ptr (i32.const 0))
    (global.set $addr (i32.const 0))

    (block $parsing
      (br_if $parsing (i32.eqz (call $parse_octet)))
      (br_if $parsing (i32.eqz (call $parse_stop)))
      (br_if $parsing (i32.eqz (call $parse_octet)))
      (br_if $parsing (i32.eqz (call $parse_stop)))
      (br_if $parsing (i32.eqz (call $parse_octet)))
      (br_if $parsing (i32.eqz (call $parse_stop)))
      (br_if $parsing (i32.eqz (call $parse_octet)))
      (br_if $parsing (i32.eqz (call $parse_nul)))
      (return (global.get $addr))
    )

    ;; If we made it here, one of the parsing steps failed.
    (i32.const 0)
  )

  ;; Try to parse a specific character.
  (func $parse_char (param $char i32) (result i32)
    (local $actual_char i32)
    (local.set $actual_char (i32.load8_u (global.get $ptr)))
    (global.set $ptr (i32.add (global.get $ptr) (i32.const 1)))
    (i32.eq (local.get $actual_char) (local.get $char))
  )

  ;; Try to parse a full stop.
  (func $parse_stop (result i32)
    (call $parse_char (i32.const 46))
  )

  ;; Try to parse a null byte.
  (func $parse_nul (result i32)
    (call $parse_char (i32.const 0))
  )

  ;; Try to parse a octet and add it to the global $addr.
  (func $parse_octet (result i32)
    (local $i i32)
    (local $char i32)
    (local $digit i32)
    (local $octet i32)
    (local $leading i32)

    ;; Save the leading char for leading zero checks later.
    (local.set $leading (i32.load8_u (global.get $ptr)))

    (loop $loop
      ;; Read the character at the global pointer.
      (local.set $char (i32.load8_u (global.get $ptr)))

      (if
        ;; Check whether we just parsed a numeric digit.
        (i32.and
          (i32.ge_s (local.get $char) (i32.const 48)) ;; "0"
          (i32.le_s (local.get $char) (i32.const 57)) ;; "9"
        )
        (then
          ;; Convert the char to an actual number.
          (local.set $digit (i32.sub (local.get $char) (i32.const 48)))
          ;; Multiply the octet by 10 to make space for the new digit.
          (local.set $octet (i32.mul (local.get $octet) (i32.const 10)))
          ;; Add the new digit into the octet.
          (local.set $octet (i32.add (local.get $octet) (local.get $digit)))
          ;; Increment $i to count the digits we've parsed.
          (local.set $i (i32.add (local.get $i) (i32.const 1)))
          ;; Increment the global $ptr to the next character.
          (global.set $ptr (i32.add (global.get $ptr) (i32.const 1)))
          ;; Continue the loop if we have parsed < 3 digits.
          (br_if $loop (i32.lt_s (local.get $i) (i32.const 3)))
        )
      )
    )

    ;; Add the octet to the global address.
    (global.set $addr (i32.shl (global.get $addr) (i32.const 8)))
    (global.set $addr (i32.or (global.get $addr) (local.get $octet)))

    (i32.and
      (i32.and
        ;; Check the octet is <= 255.
        (i32.le_s (local.get $octet) (i32.const 255))
        ;; Check that we parsed at least one digit.
        (i32.ge_s (local.get $i) (i32.const 1))
      )
      (i32.or
        ;; Check if the octet value was 0.
        (i32.eqz (local.get $octet))
        ;; Or that the leading character was not a zero.
        (i32.ne (local.get $leading) (i32.const 48)) ;; '0'
      )
    )
  )
)
