(module
  ;; Returns 1 if $char is a vowel (aeiou) and 0 otherwise.
  (func (export "vowel") (param $char i32) (result i32)
    (block $test
      (br_if $test (i32.eq (local.get $char) (i32.const 0x41))) ;; A
      (br_if $test (i32.eq (local.get $char) (i32.const 0x45))) ;; E
      (br_if $test (i32.eq (local.get $char) (i32.const 0x49))) ;; I
      (br_if $test (i32.eq (local.get $char) (i32.const 0x4f))) ;; O
      (br_if $test (i32.eq (local.get $char) (i32.const 0x55))) ;; U

      (br_if $test (i32.eq (local.get $char) (i32.const 0x61))) ;; a
      (br_if $test (i32.eq (local.get $char) (i32.const 0x65))) ;; e
      (br_if $test (i32.eq (local.get $char) (i32.const 0x69))) ;; i
      (br_if $test (i32.eq (local.get $char) (i32.const 0x6f))) ;; o
      (br_if $test (i32.eq (local.get $char) (i32.const 0x75))) ;; u

      (return (i32.const 0))
    )

    i32.const 1
  )
)
