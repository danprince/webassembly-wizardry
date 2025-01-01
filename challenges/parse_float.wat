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
    (local $i i32) ;; The index of the char we're parsing
    (local $char i32) ;; The character we're currently parsing
    (local $digit i32) ;; The digit representation of the current character

    (local $sign i32) ;; The sign of the number
    (local $int i32) ;; The integer part of the float
    (local $frac i32) ;; The fractional part of the float
    (local $div i32) ;; The divisor required for the fractional part

    (local.set $div (i32.const 1))

    ;; Set the sign based on the first character
    (local.set $sign
      (select
        (i32.const -1)
        (i32.const 1)
        (i32.eq (i32.load8_u (i32.const 0)) (i32.const 45))
      )
    )

    ;; Advance to the next char if the sign was negative
    (if (i32.lt_s (local.get $sign) (i32.const 0))
      (then (local.set $i (i32.const 1)))
    )

    ;; Parse the integer component of the float.
    (block $int_block
      (loop $int_loop
        ;; Read the current char
        (local.set $char (i32.load8_u (local.get $i)))

        ;; Increment $i
        (local.set $i (i32.add (local.get $i) (i32.const 1)))

        ;; If we hit a decimal place, break out of this block so we can
        ;; parse the fractional part.
        (br_if $int_block (i32.eq (local.get $char) (i32.const 46)))

        ;; Convert the char to a digit
        (local.set $digit
          (call $char_to_digit (local.get $char))
        )

        ;; If digit was < 0, return 0.0
        (if (i32.lt_s (local.get $digit) (i32.const 0))
          (then (return (f32.const 0)))
        )

        ;; Add digit to value
        (local.set $int
          (i32.add
            ;; Shift $int left with a multiplication by 10
            (i32.mul (local.get $int) (i32.const 10))
            (local.get $digit)
          )
        )

        (br $int_loop)
      )
    )

    ;; Parse the fractional component of the float.
    (block $frac_block
      (loop $frac_loop
        ;; Read the current char
        (local.set $char (i32.load8_u (local.get $i)))

        ;; Increment $i
        (local.set $i (i32.add (local.get $i) (i32.const 1)))

        ;; Break out of the frac block if we reached the end of the string.
        (br_if $frac_block (i32.eqz (local.get $char)))

        ;; Convert the char to a digit
        (local.set $digit
          (call $char_to_digit (local.get $char))
        )

        ;; If digit was < 0, return 0
        (if (i32.lt_s (local.get $digit) (i32.const 0))
          (then (return (f32.const 0)))
        )

        (local.set $frac
          (i32.add
            (i32.mul (local.get $frac) (i32.const 10))
            (local.get $digit)
          )
        )

        (local.set $div (i32.mul (local.get $div) (i32.const 10)))

        (br $frac_loop)
      )
    )

    (f32.mul
      (f32.convert_i32_s (local.get $sign))
      (f32.add
        (f32.convert_i32_s (local.get $int))
        (f32.div
          (f32.convert_i32_s (local.get $frac))
          (f32.convert_i32_s (local.get $div))
        )
      )
    )
  )

  ;; Convert a char to its digit value. If it is not numeric, instead return -1.
  (func $char_to_digit (param $char i32) (result i32)
    (if
      (i32.and
        (i32.ge_s (local.get $char) (i32.const 48)) ;; 0
        (i32.le_s (local.get $char) (i32.const 57)) ;; 9
      )
      (then
        (return
          (i32.sub
            (local.get $char)
            (i32.const 48)
          )
        )
      )
    )

    ;; Return -1 to signal that $char wasn't a valid digit.
    (return (i32.const -1))
  )
)
