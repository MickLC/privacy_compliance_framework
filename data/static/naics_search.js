$(document).ready(function() {
  // Initialize NAICS search functionality
  initializeNAICSSearch();
});

function initializeNAICSSearch() {
  // Find all NAICS searchable dropdowns
  $('select.naics-searchable').each(function() {
    var $select = $(this);
    var $formGroup = $select.closest('.form-group');
    
    // Skip if already processed
    if ($formGroup.find('.naics-search-wrapper').length > 0) {
      return;
    }
    
    // Create search wrapper and input
    var $wrapper = $('<div class="naics-search-wrapper"></div>');
    var $search = $('<input type="text" class="naics-search-input" placeholder="Type to search NAICS codes (e.g., \'legal\', \'software\', \'restaurant\')...">');
    var $hint = $('<div class="naics-search-hint">Start typing to filter the dropdown list below</div>');
    
    // Store original options
    var originalOptions = $select.find('option').clone();
    var $emptyOption = $('<option value="">-- Select a NAICS code --</option>');
    
    // Set up the wrapper structure
    $select.before($wrapper);
    $wrapper.append($search).append($hint).append($select);
    
    // Initialize dropdown with empty option
    $select.empty().append($emptyOption.clone()).append(originalOptions.clone());
    
    // Add search functionality
    var searchTimeout;
    $search.on('input', function() {
      var searchTerm = $(this).val().toLowerCase().trim();
      
      // Clear previous timeout
      clearTimeout(searchTimeout);
      
      // Debounce search to improve performance
      searchTimeout = setTimeout(function() {
        filterNAICSOptions($select, originalOptions, searchTerm, $emptyOption);
      }, 150);
    });
    
    // Handle dropdown selection
    $select.on('change', function() {
      var selectedValue = $(this).val();
      var selectedText = $(this).find('option:selected').text();
      
      if (selectedValue && selectedValue !== '') {
        // Update search input to show selected item (optional)
        // $search.val(selectedText);
        
        // Add visual feedback
        $search.removeClass('naics-search-error').addClass('naics-search-success');
        
        // Update hint
        $hint.text('Selected: ' + selectedText).css('color', '#27ae60');
      } else {
        $search.removeClass('naics-search-success naics-search-error');
        $hint.text('Start typing to filter the dropdown list below').css('color', '#7f8c8d');
      }
    });
    
    // Clear search when clicking clear button (if added)
    $wrapper.on('click', '.naics-clear-search', function() {
      $search.val('');
      filterNAICSOptions($select, originalOptions, '', $emptyOption);
      $search.focus();
    });
  });
}

function filterNAICSOptions($select, originalOptions, searchTerm, $emptyOption) {
  // Clear current options
  $select.empty().append($emptyOption.clone());
  
  if (searchTerm === '') {
    // Show all options when search is empty
    $select.append(originalOptions.clone());
    return;
  }
  
  var matchedOptions = [];
  var exactMatches = [];
  var codeMatches = [];
  var descriptionMatches = [];
  
  // Filter and categorize matches
  originalOptions.each(function() {
    var $option = $(this);
    var optionText = $option.text().toLowerCase();
    var optionValue = $option.val().toLowerCase();
    
    if (optionText.includes(searchTerm)) {
      if (optionText.indexOf(searchTerm) === 0 || optionValue.indexOf(searchTerm) === 0) {
        exactMatches.push($option.clone());
      } else if (optionValue.includes(searchTerm)) {
        codeMatches.push($option.clone());
      } else {
        descriptionMatches.push($option.clone());
      }
    }
  });
  
  // Add matches in priority order (exact first, then code, then description)
  var allMatches = exactMatches.concat(codeMatches).concat(descriptionMatches);
  
  // Limit results to prevent performance issues
  var maxResults = 50;
  var displayedMatches = allMatches.slice(0, maxResults);
  
  if (displayedMatches.length > 0) {
    // Add matched options
    displayedMatches.forEach(function($option) {
      $select.append($option);
    });
    
    // Add indicator if results were truncated
    if (allMatches.length > maxResults) {
      var $moreOption = $('<option disabled>... and ' + (allMatches.length - maxResults) + ' more results (refine your search)</option>');
      $select.append($moreOption);
    }
  } else {
    // No matches found
    var $noResults = $('<option disabled>No NAICS codes match "' + searchTerm + '"</option>');
    $select.append($noResults);
  }
}

// Add CSS classes for visual feedback
$(document).ready(function() {
  // Add dynamic CSS for search feedback
  $('<style>')
    .prop('type', 'text/css')
    .html(`
      .naics-search-success {
        border-color: #27ae60 !important;
        background-color: #d5f4e6 !important;
      }
      
      .naics-search-error {
        border-color: #e74c3c !important;
        background-color: #fdf2f2 !important;
      }
      
      .naics-search-input::placeholder {
        color: #95a5a6;
        font-style: italic;
      }
      
      .naics-clear-search {
        position: absolute;
        right: 10px;
        top: 10px;
        background: none;
        border: none;
        font-size: 16px;
        color: #7f8c8d;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
      }
      
      .naics-clear-search:hover {
        color: #e74c3c;
      }
    `)
    .appendTo('head');
});