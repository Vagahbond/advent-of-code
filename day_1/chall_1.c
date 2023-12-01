#include <stdio.h>
#include <stdlib.h>

int main() {
  FILE *f = fopen("inputs.txt", "r");

  int result = 0;
  char buffer[500] = {0};

  while (fgets(buffer, 500, f) != 0) {
    char first = '\0';
    char last = '\0';
    char *it = buffer;

    while (*it != '\0') {
      if (*it >= '0' && *it <= '9') {
        if (first == '\0') {
          first = *it;
        }
        last = *it;
      }

      it++;
    }

    if (first == '\0' || last == '\0') {
      continue;
    }
    printf("adding %d and %d for %s", first - '0', last - '0', buffer);
    result += (first - '0') * 10 + (last - '0');
  }

  fclose(f);

  printf("%d\n", result);

  return 0;
}
