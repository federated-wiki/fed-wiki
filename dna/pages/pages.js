'use strict';

// https://developer.holochain.org/API_reference
// https://developer.holochain.org/Test_driven_development_features

function createPage (arg) {
  var pageObject = arg;
  var pageHash = commit("page", pageObject);
  // instantiate an itemSequence for the page
  call("items", "createItemSequence", {
    pageHash: pageHash,
    // instantiate it with an empty sequence
    itemSequence: {sequence: []}
  });

  // TODO: instantiate a pageMeta entry with the slug

  // link all pages to the DNA hash so they can be retrieved all at once
  commit("wikiPageLinks", {
    Links: [
      {
        Base: App.DNA.Hash,
        Link: pageHash,
        Tag: "wiki page"
      }
    ]
  });
  return pageHash;
}

function getPages () {
  var pages = getLinks(App.DNA.Hash, "wiki page", { Load: true });
  var result = [];
  for (var i = 0; i < pages.length; i++) {
    result.push(pages[i].Entry.title);
  }
  return result;
}

function getPage (hash) {
  var page = get(hash);
  return JSON.parse(page);
}

function getPageByTitle (params) {
  var pageHash = makeHash("page", {
    title: params.pageTitle
  });
  return getFedWikiJSON(pageHash);
}

function getFedWikiJSON (pageHash) {
  // should look like: http://connor.outlandish.academy/start-here.json
  var page = JSON.parse(get(pageHash));
  var pageLinks = getLinks(pageHash, "page item", { Load: true });

  // define a top level object for our response
  var response = {
    title: page.title
  };
  // we will populate this story array with items
  var story = [];

  for (var i = 0; i < pageLinks.length; i++) {
    // get the basic entry object
    var item = pageLinks[i].Entry;
    // create a new item which will be put into the story
    var newItem = {
      type: item.type,
      id: item.id
    };
    // pull extra, type-specific fields up
    for (var field in item.fields) {
      if (item.fields.hasOwnProperty(field)) {
        newItem[field] = item.fields[field]
      }
    }
    // add the properly item structured into the story array
    story.push(newItem);
  };

  var itemSequence = call("items", "getItemSequence", {
    pageHash: pageHash
  });

  // sort story array by itemSequence
  story = story.sort(function(a,b){
    return itemSequence.indexOf(a.id) - itemSequence.indexOf(b.id);
  });

  // set the story array as a property on the response
  response.story = story;
  return response;
}

// VALIDATION FUNCTIONS
function validateCommit (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "page":
      // validation code here
      return true;
    case "pageMeta":
      // validation code here
      return false;
    case "wikiPageLinks":
      // validation code here
      return true;
    default:
      // invalid entry name!!
      return false;
  }
}

function validatePut (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "page":
      // validation code here
      return true;
    case "pageMeta":
      // validation code here
      return false;
    case "wikiPageLinks":
      // validation code here
      return true;
    default:
      // invalid entry name!!
      return false;
  }
}

function validateMod (entryName, entry, header, replaces, pkg, sources) {
  switch (entryName) {
    case "page":
      // validation code here
      return true;
    case "pageMeta":
      // validation code here
      return false;
    case "wikiPageLinks":
      // validation code here
      return true;
    default:
      // invalid entry name
      return false;
  }
}

function validateDel (entryName, hash, pkg, sources) {
  switch (entryName) {
    case "page":
      // validation code here
      return false;
    case "pageMeta":
      // validation code here
      return false;
    case "wikiPageLinks":
      // validation code here
      return true;
    default:
      // invalid entry name!!
      return false;
  }
}

function validateLink (entryName, baseHash, links, pkg, sources) {
  switch (entryName) {
    case "wikiPageLinks":
      // validation code here
      return true;
    default:
      // invalid entry name
      return false;
  }
}

function validatePutPkg (entryName) {
  return null;
}

function validateModPkg (entryName) {
  return null;
}

function validateDelPkg (entryName) {
  return null;
}

function validateLinkPkg (entryName) {
  return null;
}

function genesis () {
  // any genesis code here
  return true;
}
