<script>
  import { createEventDispatcher } from 'svelte';

  export let onSelectionChange; // Function to call on selection change (optional)

  // Sample data for images
  let images = [
    { id: 0, src: 'https://media.istockphoto.com/id/1683003966/photo/smiling-woman.jpg?s=612x612&w=0&k=20&c=m_v19IzMmouXHq67aTrqYjtAvsDJwvmxzG8DKiVnzdw=', description: 'Alice Johnson' },
    { id: 1, src: 'https://images.pexels.com/photos/6248856/pexels-photo-6248856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Bob Smith' },
    { id: 2, src: 'https://img.freepik.com/premium-photo/young-african-american-waiter-man-hold-tray_521733-6356.jpg?w=740', description: 'Charlie Brown' },
    { id: 3, src: 'https://londondrinksguide.com/en/blog/images/w/1270/LondonDrinksGuide-10062022070129000000-633ec399bfc1d.jpg', description: 'George Clooney' },
    // Add more images as needed
  ];

  // State to track selected images
  let selectedImages = [];

  // Function to handle selection change
  function handleSelectionChange() {
    const selectedArray = Array.from(selectedImages);
    if (onSelectionChange) {
      onSelectionChange(selectedArray); // Call the passed function if it exists
    }
  }

  // Function to toggle selection of images
  function toggleSelection(image) {
      if(selectedImages.indexOf(image.id) != -1){
          selectedImages = selectedImages.filter(id => id!= image.id);
      } else{
          selectedImages = [...selectedImages, image.id]
      }
      images=[...images];
  }

  // Function to check if an image is selected
  function isSelected(image) {
    return selectedImages.indexOf(image.id) != -1;
  }

  // Function to select all images
  function selectAll() {
    images.forEach(image => selectedImages.add(image.id));
    handleSelectionChange(); // Call the function after selecting all
  }

  // Function to clear all selections
  function clearSelections() {
    selectedImages.clear();
    handleSelectionChange(); // Call the function after clearing selections
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    margin: 20px;
    max-width: 900px; /* Set a max width for the grid */
    width: 100%; /* Allow the grid to be responsive */
  }

  .image-container {
    border: 2px solid transparent;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.3s, transform 0.3s;
    position: relative;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .image-container:hover {
    transform: translateY(-4px);
  }

  .image-container.selected {
    border-color: #007BFF;
    border-width: 3px;
    transform: scale(1.05);
  }

  /* New styles for selected overlay */
  .image-container.selected::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 123, 255, 0.1); /* Semi-transparent blue overlay */
    pointer-events: none; /* Allow clicks to pass through to the image */
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  .description {
    text-align: center;
    margin-top: 8px;
    font-size: 14px;
    color: #444;
    padding: 8px;
    background-color: #f8f8f8;
    border-top: 1px solid #ddd;
  }

  h3 {
    margin: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
    color: #333;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0 20px;
  }

  li {
    background: #e9ecef;
    margin: 5px 0;
    padding: 8px;
    border: 1px solid #ddd; /* Added border for list items */
  }

  .button {
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px; /* Keeping a slight border radius for the button */
    padding: 10px 20px;
    cursor: pointer;
    margin: 10px 0;
    transition: background-color 0.3s;
  }

  .button:hover {
    background-color: #0056b3;
  }

  .card {
    border: 1px solid #ddd;
    border-radius: 8px; /* Optional: add a slight border radius to the card */
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    text-align: center; /* Center the contents of the card */
    width: 100%; /* Make the card full width */
    max-width: 900px; /* Set a max width for the card */
  }

  .button-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* Same as images */
    gap: 16px; /* Same gap as images */
  }
</style>

<div class="container">
  <div class="grid">
    {#each images as image}
      <div class="image-container {(selectedImages.indexOf(image.id) != -1) ? 'selected' : ''}" on:click={() => toggleSelection(image)}>
        <img src={image.src} alt={image.description} />
        <div class="description">{image.description}</div>
      </div>
    {/each}
  </div>
</div>
