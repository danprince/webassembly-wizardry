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
    (local $i i32)
    (local $char i32)

    (loop $loop
      (local.set $char (i32.load8_u (local.get $i)))

      (if (i32.eqz (local.get $char)) (then (return)))

      (i32.store8
        (local.get $i)
        (call $rot13_char (local.get $char))
      )

      (local.set $i (i32.add (local.get $i) (i32.const 1)))

      (br $loop)
    )
  )

  ;; Rotate a single char by 13 letters if it is alphabetic.
  (func $rot13_char (param $char i32) (result i32)
    (local $index i32)

    (if ;; A-Z
      (i32.and
        (i32.ge_s (local.get $char) (i32.const 65)) ;; A
        (i32.le_s (local.get $char) (i32.const 90)) ;; Z
      )
      (then
        (local.set $index (i32.sub (local.get $char) (i32.const 65)))
        (local.set $index (i32.add (local.get $index) (i32.const 13)))
        (local.set $index (i32.rem_u (local.get $index) (i32.const 26)))
        (local.set $index (i32.add (local.get $index) (i32.const 65)))
        (return (local.get $index))
      )
    )

    (if ;; a-z
      (i32.and
        (i32.ge_s (local.get $char) (i32.const 97)) ;; a
        (i32.le_s (local.get $char) (i32.const 122)) ;; z
      )
      (then
        (local.set $index (i32.sub (local.get $char) (i32.const 97)))
        (local.set $index (i32.add (local.get $index) (i32.const 13)))
        (local.set $index (i32.rem_u (local.get $index) (i32.const 26)))
        (local.set $index (i32.add (local.get $index) (i32.const 97)))
        (return (local.get $index))
      )
    )

    (local.get $char)
  )
)
