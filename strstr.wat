(module
  (memory (export "memory") 1)

  ;; Search for the first instance of $str2 within $str1 and return the index.
  ;;
  ;; If $str1 does not contain $str2 then return -1.
  (func (export "strstr") (param $str1 i32) (param $str2 i32) (result i32)
    (local $i i32)
    (local $idx1 i32)
    (local $idx2 i32)
    (local $chr1 i32)
    (local $chr2 i32)

    (block $search
      (loop $outer
        ;; $idx1 is the index into $str1
        (local.set $idx1 (i32.add (local.get $str1) (local.get $i)))
        ;; $idx2 is the index into $str2
        (local.set $idx2 (local.get $str2))

        (loop $inner
          ;; Read $chr1 and $chr2 from $idx1 and $idx2
          (local.set $chr1 (i32.load8_u (local.get $idx1)))
          (local.set $chr2 (i32.load8_u (local.get $idx2)))

          ;; Increment $idx1 and $idx2 to next character
          (local.set $idx1 (i32.add (local.get $idx1) (i32.const 1)))
          (local.set $idx2 (i32.add (local.get $idx2) (i32.const 1)))

          ;; Break out of search if we reached the end of $str2
          (br_if $search (i32.eqz (local.get $chr2)))

          ;; Continue while $chr1 == $chr2
          (br_if $inner (i32.eq (local.get $chr1) (local.get $chr2)))
        )

        ;; Read the current character from $str1
        (local.set $chr1 (i32.load8_u (i32.add (local.get $str1) (local.get $i))))
        ;; Increment $i to the next character
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        ;; Continue until we reach the end of $str1
        (br_if $outer (local.get $chr1))

        ;; We've reached the end of $str1 without breaking out of $search which
        ;; means we didn't find $str2.
        (return (i32.const -1))
      )
    )

    (local.get $i)
  )
)

