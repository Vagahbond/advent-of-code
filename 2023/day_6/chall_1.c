#include <math.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct {
  size_t time;
  size_t distance;
} TimeDistance;

TimeDistance createTimeDistance(size_t time, size_t distance) {
  TimeDistance td;

  td.time = time;
  td.distance = distance;
  return td;
}

TimeDistance *timeDistancesFromFile(const char *filename, int *nb_td) {
  FILE *f = fopen(filename, "r");

  if (!f) {
    printf("COULD NOT OPEN FILE\n");
  }

  size_t times[512];
  int counter = 0;

  // Go after string
  fscanf(f, " %*[^0-9] ");
  while (fscanf(f, " %ld", &times[counter])) {
    printf("Time %ld\n", times[counter]);
    counter++;
  }

  fscanf(f, "\n%*[^0-9]");

  size_t distances[512];
  counter = 0;
  while (fscanf(f, " %ld", &distances[counter]) != EOF) {
    printf("Distance : %ld\n", distances[counter]);
    counter++;
  }

  TimeDistance *tds = malloc(sizeof(TimeDistance) * counter);
  for (int i = 0; i < counter; ++i) {
    tds[i] = createTimeDistance(times[i], distances[i]);
  }

  fclose(f);

  (*nb_td) = counter;
  return tds;
}

size_t resolve_time_distance(TimeDistance td) {
  double discriminant = td.time * td.time - 4 * td.distance;

  printf("discriminant: %f\n", discriminant);

  double delta_1 = ceil((double)td.time - sqrt((double)discriminant)) / 2.0;
  double delta_2 = floor((double)td.time + sqrt((double)discriminant)) / 2.0;

  delta_1 = ceil(delta_1);
  delta_2 = floor(delta_2);
  printf("%f %f\n", delta_1, delta_2);

  // int integer_1 = ceil(delta_1);
  // int integer_2 = floor(delta_2);

  // printf("%d %d\n", integer_1, integer_2);

  return (delta_2 - delta_1) + 1;
}

// x² - Tx + D = 0
int main() {
  int nb_td;
  TimeDistance *tds = timeDistancesFromFile("./inputs_.txt", &nb_td);

  size_t res = 1;
  for (int i = 0; i < nb_td; ++i) {
    printf("%ld\n", resolve_time_distance(tds[i]));
    res *= resolve_time_distance(tds[i]);
  }
  printf("%ld\n", res);
  free(tds);
  return 0;
}
