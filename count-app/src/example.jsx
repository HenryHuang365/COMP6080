import React, { useState, useMemo } from 'react';

function ExpensiveCalculation() {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState('');

  // Memoized result of an expensive calculation
  const expensiveCalculation = useMemo(() => {
    console.log('Performing expensive calculation...');
    let sum = count;
    for (let i = 0; i < 1000000000; i++) {
      sum += i;
    }
    return sum;
  }, [count]); // Recomputes only when 'count' changes

  return (
    <div>
      <p>Expensive Calculation Result: {expensiveCalculation}</p>
      <button onClick={() => setCount(count + 1)}>Recalculate</button>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something"
      />
    </div>
  );
}

export default ExpensiveCalculation;
