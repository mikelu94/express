const graphql = require('graphql');
const Node = require('../models/node');
const Edge = require('../models/edge');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} = graphql;

const NodeType = new GraphQLObjectType({
  name: 'Node',
  fields: () => ({
    id: {type: GraphQLID},
    value: {type: GraphQLString},
    edges: {
      type: GraphQLList(EdgeType),
      resolve(obj, args){
        return Edge.find({}).or([{node1ID: obj.id},{node2ID: obj.id}]);
      }
    }
  })
});

const EdgeType = new GraphQLObjectType({
  name: 'Edge',
  fields: () => ({
    id: {type: GraphQLID},
    node1: {
      type: NodeType,
      resolve(obj, args){
        return Node.findById(obj.node1ID);
      }
    },
    node2: {
      type: NodeType,
      resolve(obj, args){
        return Node.findById(obj.node2ID);
      }
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: {
      type: NodeType,
      args: {id: {type: GraphQLID}},
      resolve(obj, args){
        return Node.findById(args.id);
      }
    },
    nodes: {
      type: GraphQLList(NodeType),
      resolve(obj, args){
        return Node.find({});
      }
    },
    edge: {
      type: EdgeType,
      args: {id: {type: GraphQLID}},
      resolve(obj, args){
        return Edge.findById(args.id);
      }
    },
    edges: {
      type: GraphQLList(EdgeType),
      resolve(obj, args){
        return Edge.find({});
      }
    },
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addNode: {
      type: NodeType,
      args: {
        value: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(obj, args){
        return Node.create(args);
      }
    },
    editNode: {
      type: NodeType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        value: {type: GraphQLString},
      },
      resolve(obj, args){
        return Node.findByIdAndUpdate(args.id, args);
      }
    },
    deleteNode: {
      type: NodeType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve(obj, args){
        return Edge.deleteMany({
          $or: [{node1ID: args.id}, {node2ID: args.id}]
        }).then(() => Node.findByIdAndDelete(args.id));
      }
    },
    addEdge: {
      type: EdgeType,
      args: {
        node1ID: {type: new GraphQLNonNull(GraphQLString)},
        node2ID: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(obj, args){
        return Edge.create(args);
      }
    },
    editEdge: {
      type: EdgeType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        node1ID: {type: GraphQLString},
        node2ID:{type: GraphQLString}
      },
      resolve(obj, args){
        return Edge.findByIdAndUpdate(args.id, args);
      }
    },
    deleteEdge: {
      type: EdgeType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(obj, args){
        return Edge.findByIdAndDelete(args.id);
      }
    },
  }
});

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

module.exports = schema;