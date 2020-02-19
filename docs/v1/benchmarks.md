<!-- markdownlint-disable no-inline-html -->

# Benchmarks

> See [the main repo](https://github.com/anycable/anycable/tree/master/benchmarks) for benchmarks reports.

## Broadcasting RTT

Broadcasting round-trip time benchmark (based on [Hashrocket's bench](https://github.com/hashrocket/websocket-shootout)) measures how much time does it take for the server to re-transmit the message to all the connected clients–the less the time, the better the _real-time-ness_ of the server.

The results of this benchmark could be seen below.

<div class="chart-container">
  <img src="./assets/images/rtt_bench.png" alt="RTT" width="80%">
</div>

## Memory usage

Memory usage of AnyCable is significantly lower than of Action Cable.

That's achieved by moving memory-intensive operations into (storing connection states and subscriptions maps, serializing data into a standalone WebSocket server.

<div class="chart-container">
  <img src="./assets/images/ram_bench.png" alt="Memory usage" width="80%">
</div>

## CPU usage

Below you can see the snapshot of CPU usage during the RTT benchmark.

<div class="chart-container">
  <div class="captioned-figure">
    <img src="./assets/images/anycable.gif" alt="AnyCable CPU">
    <label>AnyCable</label>
  </div>
  <div class="captioned-figure">
    <img src="./assets/images/actioncable.gif" alt="Action Cable CPU">
    <label>Action Cable</label>
  </div>
</div>
