#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef enum Direction Direction;
enum Direction { Left = 'L', Right = 'R' };

typedef struct node Node;
struct node {
  Node *left;
  Node *right;
  char value[3];
};

typedef struct {
  Node **roots;
  int nb_roots;
  Node *nodes;
  int nb_nodes;
  Direction *dirs;
  int nb_dirs;
} ParsedFile;

Node *nodeByValue(char *value, Node *nodes, int nb_nodes) {
  for (int i = 0; i < nb_nodes; ++i) {
    if (strncmp(nodes[i].value, value, 3) == 0) {
      return nodes + i;
    }
  }
  return NULL;
}

Node getNodeFromLine(char *line) {
  Node n = {.left = NULL, .right = NULL};
  strncpy(n.value, line, 3);
  return n;
}

Node **findRoots(Node *nodes, int nb_nodes, int *nb_roots) {
  Node **res = malloc(sizeof(Node *) * 100);
  *nb_roots = 0;

  for (int i = 0; i < nb_nodes; ++i) {
    if (nodes[i].value[2] == 'A') {
      res[*nb_roots] = &nodes[i];
      (*nb_roots)++;
    }
  }
  return res;
}

void nodeChildrenFromLine(char *line, Node *node, Node *nodes, int nb_nodes) {
  int i = 0;
  while (line[i] != '(') {
    i++;
  }
  ++i;

  node->left = nodeByValue(line + i, nodes, nb_nodes);

  while (line[i] != ' ') {
    i++;
  }
  ++i;

  node->right = nodeByValue(line + i, nodes, nb_nodes);
}

Direction *directions(const char *line, int *nb_dirs) {
  Direction *dirs = malloc(sizeof(Direction) * strlen(line));
  *nb_dirs = 0;

  while (*line != '\0') {
    if (*line == '\n') {
      line++;
      continue;
    }
    dirs[*nb_dirs] = *line;
    (*nb_dirs)++;
    line++;
  }

  return dirs;
}

void print_dirs(Direction *dirs, int nb_dirs) {
  for (int i = 0; i < nb_dirs; ++i) {
    printf("%c ", dirs[i]);
  }
  printf("\n");
}

void print_nodes(Node *nodes, int nb_nodes) {
  for (int i = 0; i < nb_nodes; ++i) {
    printf("%c%c%c\n", nodes[i].value[0], nodes[i].value[1], nodes[i].value[2]);
  }
}

ParsedFile *parse_file(const char *filename) {
  ParsedFile *res = malloc(sizeof(ParsedFile));
  res->nb_dirs = 0;
  res->nb_nodes = 0;

  res->nodes = malloc(sizeof(Node) * 800);

  FILE *f = fopen(filename, "r");

  if (!f) {
    puts("No filerino");
    exit(-1);
  }

  char line[512];

  fgets(line, 511, f);
  res->dirs = directions(line, &res->nb_dirs);

  // empty line
  fgets(line, 511, f);

  while (fgets(line, 512, f)) {
    res->nodes[res->nb_nodes] = getNodeFromLine(line);
    res->nb_nodes++;
  }

  rewind(f);
  fgets(line, 511, f);
  // empty line
  fgets(line, 511, f);

  printf("%s\n", line);
  int counter = 0;
  while (fgets(line, 256, f)) {

    nodeChildrenFromLine(line, res->nodes + counter, res->nodes, res->nb_nodes);
    ++counter;
  }

  res->roots = findRoots(res->nodes, res->nb_nodes, &res->nb_roots);
  fclose(f);
  return res;
}

void print_parsed_file(const ParsedFile *file) {
  printf("Dirs : \n");
  for (int i = 0; i < file->nb_dirs; ++i) {

    printf("%c", file->dirs[i]);
  }
  printf("\n");
}

int run_root(Node *root, Direction *dirs, int nb_dirs) {
  Node *cursor = root;
  size_t counter = 0;

  while (cursor->value[2] != 'Z') {
    switch (dirs[counter % nb_dirs]) {
    case Left:
      cursor = cursor->left;
      break;
    case Right:
      cursor = cursor->right;
      break;
    default:
      printf("Found other than left or right\n");
      printf("%d\n", dirs[counter % nb_dirs]);
      printf("%ld\n", counter % nb_dirs);
    }

    counter++;
  }

  return counter;
}

int main() {

  ParsedFile *parsed = parse_file("./input.txt");

  int revs[100];
  int max_revs = 0;
  int nb_revs = 0;

  printf("%d\n", run_root(parsed->roots[0], parsed->dirs, parsed->nb_dirs));

  for (int i = 0; i < parsed->nb_roots; ++i) {
    revs[nb_revs] = run_root(parsed->roots[i], parsed->dirs, parsed->nb_dirs);
    printf("root nb %d needs %d revs\n", i + 1, revs[nb_revs]);
    if (max_revs < revs[nb_revs]) {
      max_revs = revs[nb_revs];
    }

    nb_revs++;
  }

  size_t res = max_revs;
  int finished = 0;

  printf("max revs = %d\n", max_revs);

  while (!finished) {
    finished = 1;
    for (int i = 0; i < nb_revs; ++i) {
      if (res % revs[i] != 0) {
        finished = 0;
      }
    }

    if (!finished)
      res += max_revs;
  }
  printf("%ld", res);

  free(parsed->dirs);
  free(parsed->nodes);
  free(parsed);
  return 0;
}
