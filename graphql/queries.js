import { gql } from "@apollo/client";




export const GET_PACKAGE_BYID = gql`


query GetTripPackages($tripId: ID!) {
  tripPackages(tripId: $tripId) {
    edges {
      node {
        id
        price
        groupSize
        startDate
        endDate
        trip {
          id
          title
        }
      }
    }
  }
}


`


  export const GET_ONE_DAY_TRIPS = gql`
  query {
    trips(lengthType: ONE_DAY) {
      edges {
        node {
          ... on OneDayTripNode {
            id
            title
            description
            durationHours
            thumbnail
            cardThumbnail
            price
            groupSize
            tags
            offerType

            galleryImages{
            
                  id
                  title
                  picture
              }


        
            activities {
              id
            }
            
            provinces{
              
              id
              name
            }
            

          
        
          }
        
      
        }
      }
    }
  }


    `;










export const GET_TRIP_BY_ID = gql`

query GetTrip($id: ID!) {
  trip(id: $id) {
    __typename
    ... on OneDayTripNode {
      id
      title
      description
      tripType
      durationHours
      galleryImages{
        
        id
        title
        picture
      }
      lengthType
      tags
      price
      groupSize

       visitLocationHighlights{
        id
        title
        thumbnail
        
      }
         commonQuestions{
        id
        question
        answer
        
      }
      offerType
      thumbnail
      cardThumbnail
      provinces {
        
         
            id
            name
          
      
      }
      programSections {
        
          
            id
            order
            destination {
              id
              title
            }
            subDestinations {
              edges {
                node {
                  id
                  title
                }
              }
            }
        
        
      }
      activities {
      
          
            id
            title
        
   
          
        
      }
      importantInfos {
      
          
            id
            title
            
          
        
      }
      exclusions {
        
         
            id
            title
            
         
        
      }
    }
    ... on MultiDayTripNode {
     
              id
        title

 subTypes{
        
        id
        type
        
      }

        description
        tripType
           commonQuestions{
        id
        question
        answer
      }


       galleryImages{
        
        id
        title
        picture 
      }

        durationHours
        lengthType
        tags
        price
        groupSize
           placesOfResidence{
        id
        title
        thumbnail
        
      }
        offerType
        cardThumbnail

        content{
        id
        title
        icon
        description

        }
           thumbnails{
            id
            image
          }
         provinces{
            id
            name
          }
      placesOfResidence{
            id
            title
            location
            
          }
        conditionText
             visitLocationHighlights{
        id
        title
        thumbnail
        
        
      }
     
       dayPrograms {
            title
            subTitle
            description
            residenceName
            destination {
              id
              title
            }

       
            activities{
              edges
              {
                node{
                  id
                  title
                }
              }
            }
            subDestinations {
              id
              title
            }
            visitHighlights {
              __typename
              ... on SubDestinationNode {
                id
                title
                destination {
                  id
                  title
                }
              }
            }
          }
      
      
    }
  }
}


`;



export const GET_MULTI_DAY_TRIPS = gql`
query {
trips(lengthType: MULTI_DAY) {
  edges {
    node {
      ... on MultiDayTripNode {
        id
        title
        description

        offerType
       
        price
        durationHours
        offerType
        price
        conditionText
        
           thumbnails{
          id
          image
        }
        cardThumbnail
        
      
        groupSize
        provinces{
          id
          name
        }
        commonQuestions{
          id
          question
        }

        

        visitLocationHighlights{
          id
          title
        }

        conditions{
        
        id 

        }


        
        content{
          
          id
          title
          icon
          description

          

          
        }
        
        placesOfResidence{
          id
          title
          location
          
        }
        
        galleryImages{
          
          id
          title
          picture
        }
        
        tripType
        
        
        subTypes{
          id
          type
        }
        
       tags

       dayPrograms {
          title
          subTitle
          description
          residenceName
          destination {
            id
            title
          }
          activities{
            edges
            {
              node{
                id
                title
              }
            }
          }
          subDestinations {
            id
            title
          }
          visitHighlights {
            __typename
            ... on SubDestinationNode {
              id
              title
              destination {
                id
                title
              }
            }
          }
        }
        
      

    
      }
    }
  }
}
}

`;


export const GET_ALL_TRIPS = gql `

query ListTrips(
    $first: Int
    $after: String
    $country: String
    $groupSize: String
    $tags: [String]
    $duration: String
    $tripType: String
    $subType: String
    $price: String
    $fromDate: Date
    $toDate: Date
    $lengthType: TripLengthTypeEnum
  ) {
    trips(
      first: $first
      after: $after
      country: $country
      groupSize: $groupSize
      tags: $tags
      duration: $duration
      tripType: $tripType
      subType: $subType
      price: $price
      fromDate: $fromDate
      toDate: $toDate
      lengthType: $lengthType
    ) {
      edges {
        node {
          __typename
          ... on OneDayTripNode {
            id
            title
            description
            tripType
            durationHours
            lengthType
            price
            groupSize
            thumbnail
            cardThumbnail
          }
          ... on MultiDayTripNode {
            id
            title
            description
            tripType
            durationHours
            lengthType
            price
            groupSize
            cardThumbnail
            thumbnails {
            
                
                  id
                  image
                
              
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }


`

