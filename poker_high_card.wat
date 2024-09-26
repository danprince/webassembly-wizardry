(module
  (memory (export "memory") 1)

  ;; Analyse the five card poker hand in memory (see "Poker Notes" in README)
  ;; and return the _rank value_ of the highest card. Remember that A is high!
  (func (export "high") (result i32)
    (local $i i32)
    (local $hi i32)
    (local $val i32)

    (loop $loop
      (local.set $val (call $rank (local.get $i)))

      ;; If we find an ace, return it immediately, as we know there can't be
      ;; any higher cards.
      (if (i32.eq (local.get $val) (i32.const 1))
        (then (return (i32.const 1)))
      )

      ;; If $val > $hi, set $hi = $val
      (if
        (i32.gt_s (local.get $val) (local.get $hi))
        (then (local.set $hi (local.get $val)))
      )

      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br_if $loop (i32.lt_s (local.get $i) (i32.const 5)))
    )

    (local.get $hi)
  )

  ;; Return the rank of the $nth card.
  (func $rank (param $n i32) (result i32)
    (i32.load8_u (i32.mul (local.get $n) (i32.const 2)))
  )
)
