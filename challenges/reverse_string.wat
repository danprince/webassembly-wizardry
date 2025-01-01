(module
  (import "debug" "i32" (func $debug_i32 (param i32)))
  (import "debug" "char" (func $debug_char (param i32)))

  (memory (export "memory") 1)

  ;; Reverse a string in place in memory.
  (func (export "reverse")
    (local $i i32) ;; left index
    (local $j i32) ;; right index
    (local $a i32) ;; left char
    (local $b i32) ;; right char

    ;; Move $j right until we find the end of the string.
    (loop $loop
      (local.set $j (i32.add (local.get $j) (i32.const 1)))
      (br_if $loop (i32.load8_u (local.get $j)))
      (local.set $j (i32.sub (local.get $j) (i32.const 1)))
    )

    (loop $loop
      (local.set $a (i32.load8_u (local.get $i)))
      (local.set $b (i32.load8_u (local.get $j)))
      (i32.store8 (local.get $i) (local.get $b))
      (i32.store8 (local.get $j) (local.get $a))
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (local.set $j (i32.sub (local.get $j) (i32.const 1)))
      (br_if $loop (i32.lt_s (local.get $i) (local.get $j)))
    )
  )
)
