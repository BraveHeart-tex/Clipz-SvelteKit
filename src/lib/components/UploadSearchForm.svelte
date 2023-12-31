<script lang="ts">
  let searchQuery = '';
  let status = 1;
</script>

<form class="grid grid-cols-1 md:grid-cols-2 gap-2 my-5">
  <div>
    <label for="q">Search By Title or Description</label>
    <input
      name="q"
      id="q"
      class="input rounded-md"
      type="text"
      placeholder="Enter a search term"
      bind:value={searchQuery}
    />
  </div>
  <div>
    <label for="status">Status</label>
    <select id="status" name="status" class="select rounded-md">
      <option value="0">All</option>
      <option value="1">Pending Review</option>
      <option value="2">In review</option>
      <option value="3">Published</option>
      <option value="4">Rejected</option>
    </select>
  </div>
  <button type="submit" class="w-max btn rounded-md variant-filled-primary"
    >Search</button
  >
</form>
