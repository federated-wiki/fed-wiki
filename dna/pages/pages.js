'use strict';

var wikiName = "TheFederation"
// TODO: how should this get set

// https://developer.holochain.org/API_reference
// https://developer.holochain.org/Test_driven_development_features

function createPage (arg) {
  var pageObject = arg;
  //Todo: name wiki
  //pageObject["wikiName"] = wikiName;
  pageObject["wikiId"] = App.Agent.Hash;
  var pageHash = commit("page", pageObject);
  // instantiate an itemSequence for the page
  call("items", "createItemSequence", {
    pageHash: pageHash,
    // instantiate it with an empty sequence
    itemSequence: {sequence: []}
  });
  commit("wikiPageLinks", {
    Links: [
      {
        Base: App.Agent.Hash,
        Link: pageHash,
        Tag: "wiki page"
      }
    ]
  })
  return pageHash;
}

function renamePage (arg) {
  var newPage = {title: arg.newEntry.title, wikiId: App.Agent.Hash};
  var hash = update("page", newPage, arg.pageHash);

  // get existing links to items
  var itemLinks = getLinks(arg.pageHash, "page item");
  // point from this new base, to the old ones
  for (var i = 0; i < itemLinks.length; i++) {
    // todo: assign result to var and error check
    commit("pageLinks", {
      Links: [
        {
          Base: hash,
          Link: itemLinks[0].Hash,
          Tag: "page item"
        }
      ]
    });
  }

  // get existing links to itemSequence
  var sequenceLinks = getLinks(arg.pageHash, "page sequence");
  // point from this new base, to that old
  commit("pageLinks", {
    Links: [
      {
        Base: hash,
        Link: sequenceLinks[0].Hash,
        Tag: "page sequence"
      }
    ]
  });

  return hash;
}

function getPage (hash) {
  var page = get(hash);
  return JSON.parse(page);
}

function getFedWikiJSON (pageHash) {
  // should look like: http://connor.outlandish.academy/start-here.json
  var page = JSON.parse(get(pageHash));
  var pageLinks = getLinks(pageHash, "page item", { Load: true });

  // TODO: get itemSequence, and use that to order the items

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
  story = story.map(function(e,i){return i;})
               .sort(function(a,b){return itemSequence[a] - itemSequence[b];})
               .map(function(e){return story[e];});

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
    default:
      // invalid entry name!!
      return false;
  }
}

function validateLink (entryName, baseHash, links, pkg, sources) {
  switch (entryName) {
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
